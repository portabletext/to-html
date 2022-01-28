import type {PortableTextHtmlSerializers, PortableTextSerializers} from '../types'

export function mergeSerializers(
  parent: PortableTextHtmlSerializers,
  overrides: PortableTextSerializers
): PortableTextHtmlSerializers {
  const {block, list, listItem, marks, types, ...rest} = overrides
  // @todo figure out how to not `as ...` these
  return {
    ...parent,
    block: mergeDeeply(parent, overrides, 'block') as PortableTextHtmlSerializers['block'],
    list: mergeDeeply(parent, overrides, 'list') as PortableTextHtmlSerializers['list'],
    listItem: mergeDeeply(parent, overrides, 'listItem') as PortableTextHtmlSerializers['listItem'],
    marks: mergeDeeply(parent, overrides, 'marks') as PortableTextHtmlSerializers['marks'],
    types: mergeDeeply(parent, overrides, 'types') as PortableTextHtmlSerializers['types'],
    ...rest,
  }
}

function mergeDeeply(
  parent: PortableTextHtmlSerializers,
  overrides: PortableTextSerializers,
  key: 'block' | 'list' | 'listItem' | 'marks' | 'types'
): PortableTextHtmlSerializers[typeof key] {
  const override = overrides[key]
  const parentVal = parent[key]

  if (typeof override === 'function') {
    return override
  }

  if (override && typeof parentVal === 'function') {
    return override
  }

  if (override) {
    return {...parentVal, ...override} as PortableTextHtmlSerializers[typeof key]
  }

  return parentVal
}
