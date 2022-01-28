import type {PortableTextListSerializer, PortableTextListItemSerializer} from '../types'

export const defaultLists: Record<'number' | 'bullet', PortableTextListSerializer> = {
  number: ({children}) => `<ol>${children}</ol>`,
  bullet: ({children}) => `<ul>${children}</ul>`,
}

export const DefaultListItem: PortableTextListItemSerializer = ({children}) =>
  `<li>${children}</li>`
