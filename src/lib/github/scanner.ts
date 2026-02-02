import { Octokit } from '@octokit/rest'

export interface ScanResult {
  path: string
  language: string
  matchCount: number
  preview: string
  sha: string
  content: string
}

const SUPPORTED_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx',
  '.py',
  '.go',
  '.java',
  '.rb',
  '.php',
  '.cs'
]

const LOGGING_PATTERNS = [
  // JavaScript/TypeScript
  /console\.(log|error|warn|info|debug)\s*\(/g,
  /logger\.(log|error|warn|info|debug)\s*\(/g,
  
  // Python
  /print\s*\(/g,
  /logging\.(debug|info|warning|error|critical)\s*\(/g,
  /logger\.(debug|info|warning|error|critical)\s*\(/g,
  
  // Go
  /log\.(Print|Printf|Println|Fatal|Fatalf|Fatalln|Panic|Panicf|Panicln)\s*\(/g,
  /fmt\.(Print|Printf|Println)\s*\(/g,
  
  // Java
  /logger\.(trace|debug|info|warn|error)\s*\(/g,
  /System\.out\.print(ln)?\s*\(/g,
  /log\.(trace|debug|info|warn|error)\s*\(/g,
  
  // Ruby
  /puts\s+/g,
  /logger\.(debug|info|warn|error|fatal)\s*\(/g,
  
  // PHP
  /error_log\s*\(/g,
  /var_dump\s*\(/g,
  
  // C#
  /Console\.Write(Line)?\s*\(/g,
  /_logger\.(Log|Debug|Info|Warn|Error)\s*\(/g,
]

export async function scanRepository(
  owner: string,
  repo: string,
  token: string
): Promise<ScanResult[]> {
  const octokit = new Octokit({ auth: token })
  const results: ScanResult[] = []

  try {
    // Get the default branch
    const { data: repoData } = await octokit.repos.get({ owner, repo })
    const defaultBranch = repoData.default_branch

    // Get the tree recursively
    const { data: tree } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: 'true',
    })

    // Filter for relevant files
    const relevantFiles = tree.tree.filter((item) => {
      if (item.type !== 'blob') return false
      const path = item.path || ''
      return SUPPORTED_EXTENSIONS.some((ext) => path.endsWith(ext))
    })

    // Limit to first 50 files to avoid rate limits
    const filesToScan = relevantFiles.slice(0, 50)

    // Scan each file
    for (const file of filesToScan) {
      try {
        const { data: blob } = await octokit.git.getBlob({
          owner,
          repo,
          file_sha: file.sha!,
        })

        // Decode base64 content
        const content = Buffer.from(blob.content, 'base64').toString('utf-8')

        // Check for logging patterns
        let matchCount = 0
        for (const pattern of LOGGING_PATTERNS) {
          const matches = content.match(pattern)
          if (matches) {
            matchCount += matches.length
          }
        }

        if (matchCount > 0) {
          // Get a preview of the first match
          const lines = content.split('\n')
          let preview = ''
          for (const line of lines) {
            if (LOGGING_PATTERNS.some((p) => p.test(line))) {
              preview = line.trim().substring(0, 100)
              break
            }
          }

          // Determine language from extension
          const ext = file.path!.split('.').pop() || ''
          const language = getLanguageFromExtension(ext)

          results.push({
            path: file.path!,
            language,
            matchCount,
            preview,
            sha: file.sha!,
            content,
          })
        }
      } catch (error) {
        console.error(`Error scanning file ${file.path}:`, error)
        // Continue with next file
      }
    }

    return results.sort((a, b) => b.matchCount - a.matchCount)
  } catch (error) {
    console.error('Error scanning repository:', error)
    throw new Error('Failed to scan repository')
  }
}

function getLanguageFromExtension(ext: string): string {
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    go: 'go',
    java: 'java',
    rb: 'ruby',
    php: 'php',
    cs: 'csharp',
  }
  return languageMap[ext] || ext
}
