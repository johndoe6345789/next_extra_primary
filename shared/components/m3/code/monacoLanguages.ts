import type { Monaco } from '@monaco-editor/react'

/**
 * Language name to Monaco language ID mapping.
 */
const LANGUAGE_MAP: Record<string, string> = {
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  JSX: 'javascript',
  TSX: 'typescript',
  Python: 'python',
  Java: 'java',
  'C++': 'cpp',
  'C#': 'csharp',
  Go: 'go',
  Rust: 'rust',
  PHP: 'php',
  Ruby: 'ruby',
  SQL: 'sql',
  HTML: 'html',
  CSS: 'css',
  JSON: 'json',
  YAML: 'yaml',
  Markdown: 'markdown',
  XML: 'xml',
  Shell: 'shell',
  Bash: 'shell',
}

/**
 * Get Monaco language ID from human-readable
 * language name.
 */
export function getMonacoLanguage(
  language: string
): string {
  return (
    LANGUAGE_MAP[language] ||
    language.toLowerCase()
  )
}

/**
 * Configure TypeScript support in Monaco.
 */
export function configureMonacoTypeScript(
  monaco: Monaco
) {
  if (monaco.languages.typescript) {
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(
      true
    )
  }
}
