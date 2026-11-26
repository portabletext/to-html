const charMap: Record<string, string> = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": '#x27',
}

export function escapeHTML(str: string): string {
  return replaceMultipleSpaces(escapeHTMLChars(str))
}

/**
 * Escapes the HTML-significant characters of a string, without the whitespace
 * normalization that `escapeHTML` applies. Suitable for attribute values and
 * other places where the input is not user-facing prose.
 *
 * @internal
 */
export function escapeHTMLChars(str: string): string {
  return str.replace(/[&<>"']/g, (s) => `&${charMap[s]};`)
}

export function replaceMultipleSpaces(str: string): string {
  return str.replace(/ {2,}/g, (match: string) => `${'&nbsp;'.repeat(match.length - 1)} `)
}
