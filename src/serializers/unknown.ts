import type {PortableTextHtmlSerializers} from '../types'
import {unknownTypeWarning} from '../warnings'

export const DefaultUnknownType: PortableTextHtmlSerializers['unknownType'] = ({
  value,
  isInline,
}) => {
  const warning = unknownTypeWarning(value._type)
  return isInline
    ? `<span style="display:hidden">${warning}</span>`
    : `<div style="display:hidden">${warning}</div>`
}

export const DefaultUnknownMark: PortableTextHtmlSerializers['unknownMark'] = ({
  markType,
  children,
}) => {
  return `<span class="unknown__pt__mark__${markType}">${children}</span>`
}

export const DefaultUnknownBlockStyle: PortableTextHtmlSerializers['unknownBlockStyle'] = ({
  children,
}) => {
  return `<p>${children}</p>`
}

export const DefaultUnknownList: PortableTextHtmlSerializers['unknownList'] = ({children}) => {
  return `<ul>${children}</ul>`
}

export const DefaultUnknownListItem: PortableTextHtmlSerializers['unknownListItem'] = ({
  children,
}) => {
  return `<li>${children}</li>`
}
