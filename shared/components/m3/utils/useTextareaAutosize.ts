import { useRef, useEffect, useCallback } from 'react'

/**
 * Hook that syncs textarea height to its
 * content using a shadow textarea.
 */
export function useTextareaAutosize(
  minRows: number,
  maxRows: number | undefined,
  value: unknown,
  ref: React.MutableRefObject<HTMLTextAreaElement | null>
) {
  const shadowRef =
    useRef<HTMLTextAreaElement | null>(null)

  const syncHeight = useCallback(() => {
    const textarea = ref.current
    const shadow = shadowRef.current
    if (!textarea || !shadow) return

    const cs =
      window.getComputedStyle(textarea)
    const lh = parseFloat(cs.lineHeight) || 20

    shadow.style.width = cs.width
    shadow.style.font = cs.font
    shadow.style.letterSpacing = cs.letterSpacing
    shadow.style.padding = cs.padding
    shadow.style.border = cs.border
    shadow.value =
      textarea.value ||
      textarea.placeholder ||
      'x'

    const minH = lh * minRows
    const maxH = maxRows
      ? lh * maxRows
      : Infinity

    shadow.style.height = 'auto'
    const scrollH = shadow.scrollHeight
    const newH = Math.min(
      Math.max(scrollH, minH),
      maxH
    )

    textarea.style.height = `${newH}px`
    textarea.style.overflow =
      scrollH > maxH ? 'auto' : 'hidden'
  }, [minRows, maxRows, ref])

  useEffect(() => {
    syncHeight()
  }, [value, syncHeight])

  useEffect(() => {
    const onResize = () => syncHeight()
    window.addEventListener('resize', onResize)
    return () =>
      window.removeEventListener(
        'resize',
        onResize
      )
  }, [syncHeight])

  return { shadowRef, syncHeight }
}
