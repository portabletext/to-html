import type {TypedObject} from '@portabletext/types'

import {escapeHTML, uriLooksSafe} from '../escape'
import type {PortableTextMarkComponent} from '../types'

interface DefaultLink extends TypedObject {
  _type: 'link'
  href: string
}

const link: PortableTextMarkComponent<DefaultLink> = ({children, value}) => {
  const href = value?.href || ''
  const looksSafe = uriLooksSafe(href)
  return looksSafe ? `<a href="${escapeHTML(href)}">${children}</a>` : children
}

export const defaultMarks: Record<string, PortableTextMarkComponent | undefined> = {
  'em': ({children}) => `<em>${children}</em>`,
  'strong': ({children}) => `<strong>${children}</strong>`,
  'code': ({children}) => `<code>${children}</code>`,
  'underline': ({children}) => `<span style="text-decoration:underline">${children}</span>`,
  'strike-through': ({children}) => `<del>${children}</del>`,
  link,
}
