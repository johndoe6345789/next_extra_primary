/**
 * SVG generation for favicon designs
 */

import type { FaviconDesign } from './_types/favicon/types'

/** Generate SVG string from design */
export function generateSVG(
  design: FaviconDesign
): string {
  const s = design.size
  let svg =
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `width="${s}" height="${s}" ` +
    `viewBox="0 0 ${s} ${s}">`
  svg +=
    `<rect width="${s}" height="${s}" ` +
    `fill="${design.backgroundColor}"/>`

  design.elements.forEach((el) => {
    const t =
      `translate(${el.x},${el.y}) ` +
      `rotate(${el.rotation})`
    if (el.type === 'circle') {
      svg +=
        `<circle cx="0" cy="0" ` +
        `r="${el.width / 2}" ` +
        `fill="${el.color}" transform="${t}"/>`
    } else if (el.type === 'square') {
      svg +=
        `<rect x="${-el.width / 2}" ` +
        `y="${-el.height / 2}" ` +
        `width="${el.width}" ` +
        `height="${el.height}" ` +
        `fill="${el.color}" transform="${t}"/>`
    } else if (el.type === 'text') {
      svg +=
        `<text x="0" y="0" fill="${el.color}" ` +
        `font-size="${el.fontSize}" ` +
        `font-weight="${el.fontWeight}" ` +
        `text-anchor="middle" ` +
        `dominant-baseline="middle" ` +
        `transform="${t}">${el.text}</text>`
    }
  })

  svg += '</svg>'
  return svg
}

/** Download a blob with a given filename */
export function downloadBlob(
  blob: Blob,
  filename: string
) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
