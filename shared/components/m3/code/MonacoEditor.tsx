'use client'

import {
  lazy, Suspense, type ComponentType,
} from 'react'
import type { Monaco }
  from '@monaco-editor/react'
import {
  getMonacoLanguage,
  configureMonacoTypeScript,
} from './monacoLanguages'
import { getMonacoDefaults }
  from './monacoDefaults'
import { MonacoEditorFallback }
  from './MonacoEditorFallback'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Editor = lazy(() =>
  import('@monaco-editor/react').then(
    (mod) => ({
      default: mod.default as ComponentType<
        Record<string, unknown>
      >,
    })
  )
)

export {
  getMonacoLanguage,
  configureMonacoTypeScript,
}

export interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  height?: string
  readOnly?: boolean
  theme?: 'vs-dark' | 'light' | 'vs'
  options?: Record<string, unknown>
  beforeMount?: (monaco: Monaco) => void
  testId?: string
}

/**
 * Monaco Editor wrapper with lazy loading
 * and TypeScript support.
 */
export function MonacoEditor({
  value, onChange, language,
  height = '400px', readOnly = false,
  theme = 'vs-dark', options = {},
  beforeMount, testId,
}: MonacoEditorProps) {
  const lang = getMonacoLanguage(language)
  const handleBeforeMount = (m: Monaco) => {
    configureMonacoTypeScript(m)
    beforeMount?.(m)
  }
  return (
    <Suspense fallback={
      <MonacoEditorFallback height={height} />
    }>
      <div data-testid={
        testId ?? 'monaco-editor-container'}
        role="region"
        aria-label={
          `Code editor (${readOnly ? 'read-only' : 'editable'}, ${lang})`}>
        <div className="sr-only" role="status"
          aria-live="polite"
          aria-atomic="true"
          data-testid="monaco-editor-status">
          {lang} editor loaded.
          {readOnly
            ? ' Read-only.' : ' Editable.'}
        </div>
        <Editor height={height}
          language={lang} value={value}
          onChange={(v: string | undefined) =>
            onChange(v || '')}
          theme={theme}
          beforeMount={handleBeforeMount}
          options={getMonacoDefaults(
            readOnly, options)} />
      </div>
    </Suspense>
  )
}
