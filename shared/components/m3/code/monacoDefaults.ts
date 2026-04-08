/**
 * Default options for the Monaco editor.
 * @param readOnly - Whether editor is readonly.
 * @param overrides - User-supplied overrides.
 * @returns Merged options object.
 */
export function getMonacoDefaults(
  readOnly: boolean,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    readOnly,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      useShadows: false,
    },
    padding: { top: 12, bottom: 12 },
    fontFamily:
      'JetBrains Mono, monospace',
    fontLigatures: true,
    ...overrides,
  };
}
