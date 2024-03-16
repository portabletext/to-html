import type {PortableTextBlockStyle} from '@portabletext/types'

import type {PortableTextBlockComponent, PortableTextHtmlComponents} from '../types'
import {DefaultListItem,defaultLists} from './list'
import {defaultMarks} from './marks'
import {
  DefaultUnknownBlockStyle,
  DefaultUnknownList,
  DefaultUnknownListItem,
  DefaultUnknownMark,
  DefaultUnknownType,
} from './unknown'

export const DefaultHardBreak = (): string => '<br/>'

export const defaultPortableTextBlockStyles: Record<
  PortableTextBlockStyle,
  PortableTextBlockComponent | undefined
> = {
  normal: ({children}) => `<p>${children}</p>`,
  blockquote: ({children}) => `<blockquote>${children}</blockquote>`,
  h1: ({children}) => `<h1>${children}</h1>`,
  h2: ({children}) => `<h2>${children}</h2>`,
  h3: ({children}) => `<h3>${children}</h3>`,
  h4: ({children}) => `<h4>${children}</h4>`,
  h5: ({children}) => `<h5>${children}</h5>`,
  h6: ({children}) => `<h6>${children}</h6>`,
}

export const defaultComponents: PortableTextHtmlComponents = {
  types: {},

  block: defaultPortableTextBlockStyles,
  marks: defaultMarks,
  list: defaultLists,
  listItem: DefaultListItem,
  hardBreak: DefaultHardBreak,

  unknownType: DefaultUnknownType,
  unknownMark: DefaultUnknownMark,
  unknownList: DefaultUnknownList,
  unknownListItem: DefaultUnknownListItem,
  unknownBlockStyle: DefaultUnknownBlockStyle,
}
