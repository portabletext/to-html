const map: Record<string, string> = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": '#x27',
}

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (s) => `&${map[s]};`)
}
