import type {PortableTextComponents, PortableTextHtmlComponents} from '../types'

export function mergeComponents(
  parent: PortableTextHtmlComponents,
  overrides: PortableTextComponents,
): PortableTextHtmlComponents {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {block, list, listItem, marks, types, ...rest} = overrides
  return {
    ...parent,
    block: mergeBlockComponent(parent.block, overrides.block),
    list: mergeListComponent(parent.list, overrides.list),
    listItem: mergeListItemComponent(parent.listItem, overrides.listItem),
    marks: mergeMarksComponent(parent.marks, overrides.marks),
    types: mergeTypesComponent(parent.types, overrides.types),
    ...rest,
  }
}

function mergeBlockComponent(
  parentVal: PortableTextHtmlComponents['block'],
  override: PortableTextComponents['block'],
): PortableTextHtmlComponents['block'] {
  if (typeof override === 'function') {
    return override
  }

  if (override) {
    return typeof parentVal === 'function' ? override : {...parentVal, ...override}
  }

  return parentVal
}

function mergeListComponent(
  parentVal: PortableTextHtmlComponents['list'],
  override: PortableTextComponents['list'],
): PortableTextHtmlComponents['list'] {
  if (typeof override === 'function') {
    return override
  }

  if (override) {
    return typeof parentVal === 'function' ? override : {...parentVal, ...override}
  }

  return parentVal
}

function mergeListItemComponent(
  parentVal: PortableTextHtmlComponents['listItem'],
  override: PortableTextComponents['listItem'],
): PortableTextHtmlComponents['listItem'] {
  if (typeof override === 'function') {
    return override
  }

  if (override) {
    return typeof parentVal === 'function' ? override : {...parentVal, ...override}
  }

  return parentVal
}

function mergeMarksComponent(
  parentVal: PortableTextHtmlComponents['marks'],
  override: PortableTextComponents['marks'],
): PortableTextHtmlComponents['marks'] {
  if (!override) {
    return parentVal
  }

  return {...parentVal, ...override}
}

function mergeTypesComponent(
  parentVal: PortableTextHtmlComponents['types'],
  override: PortableTextComponents['types'],
): PortableTextHtmlComponents['types'] {
  if (!override) {
    return parentVal
  }

  return {...parentVal, ...override}
}
