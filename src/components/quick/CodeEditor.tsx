'use client'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  placeholder?: string
  readOnly?: boolean
}

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder = '',
  readOnly = false,
}: CodeEditorProps) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full h-64 p-4 font-mono text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
        spellCheck={false}
      />
    </div>
  )
}
