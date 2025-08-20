const allowedProtocols = ['http', 'https', 'mailto', 'tel']
const charMap: Record<string, string> = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": '#x27',
}

export function escapeHTML(str: string): string {
  return replaceMultipleSpaces(str.replace(/[&<>"']/g, (s) => `&${charMap[s]};`))
}

export function replaceMultipleSpaces(str: string): string {
  return str.replace(/ {2,}/g, (match: string) => `${'&nbsp;'.repeat(match.length - 1)} `)
}

export function uriLooksSafe(uri: string): boolean {
  const url = (uri || '').trim()
  const first = url.charAt(0)

  // Allow hash-links, absolute paths and "same-protocol" (//foo.bar) URLs
  if (first === '#' || first === '/') {
    return true
  }

  // If the URL does not contain a `:`, allow it
  const colonIndex = url.indexOf(':')
  if (colonIndex === -1) {
    return true
  }

  // If the protocol is in the allowed list, treat it as OK
  const proto = url.slice(0, colonIndex).toLowerCase()
  if (allowedProtocols.indexOf(proto) !== -1) {
    return true
  }

  // If the URL is `site/search?query=author:espen`, allow it
  const queryIndex = url.indexOf('?')
  if (queryIndex !== -1 && colonIndex > queryIndex) {
    return true
  }

  // If the URL is `site/search#my:encoded:data`, allow it
  const hashIndex = url.indexOf('#')
  if (hashIndex !== -1 && colonIndex > hashIndex) {
    return true
  }

  return false
}
