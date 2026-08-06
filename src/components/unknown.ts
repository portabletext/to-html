import {escapeHTMLChars} from '../escape'
import type {PortableTextHtmlComponents} from '../types'
import {unknownTypeWarning} from '../warnings'

export const DefaultUnknownType: PortableTextHtmlComponents['unknownType'] = ({
  value,
  isInline,
}) => {
  // The warning embeds the (user-controlled) `_type`, so it must be escaped
  // before being placed in the document
  const warning = escapeHTMLChars(unknownTypeWarning(value._type))
  return isInline
    ? `<span style="display:none">${warning}</span>`
    : `<div style="display:none">${warning}</div>`
}

export const DefaultUnknownMark: PortableTextHtmlComponents['unknownMark'] = ({
  markType,
  children,
}) => {
  return `<span class="unknown__pt__mark__${escapeHTMLChars(markType)}">${children}</span>`
}

export const DefaultUnknownBlockStyle: PortableTextHtmlComponents['unknownBlockStyle'] = ({
  children,
}) => {
  return `<p>${children}</p>`
}

export const DefaultUnknownList: PortableTextHtmlComponents['unknownList'] = ({children}) => {
  return `<ul>${children}</ul>`
}

export const DefaultUnknownListItem: PortableTextHtmlComponents['unknownListItem'] = ({
  children,
}) => {
  return `<li>${children}</li>`
}
