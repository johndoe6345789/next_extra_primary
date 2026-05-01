import React from 'react'
import styles from '../../../scss/atoms/markdown.module.scss'

export interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
  content?: string
  children?: string
  className?: string
  /** Test ID for automated testing */
  testId?: string
}

/**
 * Markdown renderer component
 * Renders markdown content as HTML
 * Uses the 'marked' library when available
 */
export const Markdown: React.FC<MarkdownProps> = ({
  content,
  children,
  testId,
  className = '',
  ...props
}) => {
  const markdownContent = content || children || ''

  /** Apply inline markdown: bold, italic, code, links. */
  const inlineFmt = (t: string): string => t
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

  const renderMarkdown = (md: string): string => {
    // Protect fenced code blocks from line processing
    const parts = md.split(/(```[\s\S]*?```)/g)
    return parts.map((part, pi) => {
      if (pi % 2 === 1) {
        const code = part
          .replace(/^```\w*\n?/, '').replace(/```$/, '')
        return `<pre><code>${code}</code></pre>`
      }
      const out: string[] = []
      let inUl = false; let inOl = false
      const closeLists = () => {
        if (inUl) { out.push('</ul>'); inUl = false }
        if (inOl) { out.push('</ol>'); inOl = false }
      }
      for (const line of part.split('\n')) {
        if (line.startsWith('### '))
          { closeLists(); out.push(`<h3>${inlineFmt(line.slice(4))}</h3>`) }
        else if (line.startsWith('## '))
          { closeLists(); out.push(`<h2>${inlineFmt(line.slice(3))}</h2>`) }
        else if (line.startsWith('# '))
          { closeLists(); out.push(`<h1>${inlineFmt(line.slice(2))}</h1>`) }
        else if (line.startsWith('> '))
          { closeLists()
            out.push(`<blockquote><p>${inlineFmt(line.slice(2))}</p></blockquote>`) }
        else if (/^[-*] /.test(line))
          { if (!inUl) { out.push('<ul>'); inUl = true }
            out.push(`<li>${inlineFmt(line.slice(2))}</li>`) }
        else if (/^\d+\. /.test(line))
          { if (!inOl) { out.push('<ol>'); inOl = true }
            out.push(`<li>${inlineFmt(line.replace(/^\d+\. /, ''))}</li>`) }
        else if (line.trim() === '') { closeLists() }
        else { closeLists(); out.push(`<p>${inlineFmt(line)}</p>`) }
      }
      closeLists()
      return out.join('')
    }).join('')
  }

  return (
    <div
      className={`${styles.markdown} ${className}`.trim()}
      data-testid={testId}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(markdownContent) }}
      {...props}
    />
  )
}

export default Markdown
