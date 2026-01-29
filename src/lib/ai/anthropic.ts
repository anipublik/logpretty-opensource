import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface TransformResult {
  code: string
  library: string
  install: string
  imports: string[]
  tips: string[]
}

export async function transformLog(
  input: string,
  language: string
): Promise<TransformResult> {
  const prompt = getTransformPrompt(input, language)
  
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return parseResponse(text, language)
}

function getTransformPrompt(input: string, language: string): string {
  return `Transform this ${language} logging code to structured JSON logging.

Input:
${input}

Return ONLY a JSON object (no markdown):
{
  "code": "transformed code here",
  "library": "recommended library",
  "install": "installation command",
  "imports": ["import lines"],
  "tips": ["improvement 1", "improvement 2"]
}

Requirements:
- Use structured key-value logging
- Proper log levels (debug/info/warn/error)
- Add correlation/trace IDs where relevant
- Follow ${language} naming conventions
- Make the code production-ready`
}

function parseResponse(response: string, language: string): TransformResult {
  try {
    let json = response.trim()
    
    if (json.includes('```json')) {
      json = json.split('```json')[1].split('```')[0].trim()
    } else if (json.includes('```')) {
      json = json.split('```')[1].split('```')[0].trim()
    }
    
    const parsed = JSON.parse(json)
    
    return {
      code: parsed.code || response,
      library: parsed.library || 'unknown',
      install: parsed.install || '',
      imports: parsed.imports || [],
      tips: parsed.tips || [],
    }
  } catch (error) {
    return {
      code: response,
      library: 'unknown',
      install: '',
      imports: [],
      tips: [],
    }
  }
}
