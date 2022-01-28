import type {PortableTextMarkSerializer, TypedObject} from '../types'
import {escapeHtml} from '../escape'

interface DefaultLink extends TypedObject {
  _type: 'link'
  href: string
}

const link: PortableTextMarkSerializer<DefaultLink> = ({children, value}) =>
  `<a href="${escapeHtml(value?.href || '')}">${children}</a>`

export const defaultMarks: Record<string, PortableTextMarkSerializer | undefined> = {
  em: ({children}) => `<em>${children}</em>`,
  strong: ({children}) => `<strong>${children}</strong>`,
  code: ({children}) => `<code>${children}</code>`,
  underline: ({children}) => `<span style="text-decoration:underline">${children}</span>`,
  'strike-through': ({children}) => `<del>${children}</del>`,
  link,
}
