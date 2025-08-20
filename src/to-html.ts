import {
  buildMarksTree,
  isPortableTextBlock,
  isPortableTextListItemBlock,
  isPortableTextToolkitList,
  isPortableTextToolkitSpan,
  isPortableTextToolkitTextNode,
  nestLists,
  spanToPlainText,
  type ToolkitNestedPortableTextSpan,
  type ToolkitTextNode,
} from '@portabletext/toolkit'
import type {
  ArbitraryTypedObject,
  PortableTextBlock,
  PortableTextListItemBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
  TypedObject,
} from '@portabletext/types'

import {defaultComponents} from './components/defaults'
import {mergeComponents} from './components/merge'
import type {
  HtmlPortableTextList,
  MissingComponentHandler,
  NodeRenderer,
  PortableTextHtmlComponents,
  PortableTextOptions,
  Serializable,
  SerializedBlock,
} from './types'
import {
  printWarning,
  unknownBlockStyleWarning,
  unknownListItemStyleWarning,
  unknownListStyleWarning,
  unknownMarkWarning,
  unknownTypeWarning,
} from './warnings'

export function toHTML<B extends TypedObject = PortableTextBlock | ArbitraryTypedObject>(
  value: B | B[],
  options: PortableTextOptions = {},
): string {
  const {
    components: componentOverrides,
    onMissingComponent: missingComponentHandler = printWarning,
  } = options

  const handleMissingComponent = missingComponentHandler || noop
  const blocks = Array.isArray(value) ? value : [value]
  const nested = nestLists(blocks, 'html')
  const components = componentOverrides
    ? mergeComponents(defaultComponents, componentOverrides)
    : defaultComponents

  const renderNode = getNodeRenderer(components, handleMissingComponent)
  const rendered = nested.map((node, index) =>
    renderNode({node: node, index, isInline: false, renderNode}),
  )

  return rendered.join('')
}

const getNodeRenderer = (
  components: PortableTextHtmlComponents,
  handleMissingComponent: MissingComponentHandler,
): NodeRenderer => {
  function renderNode<N extends TypedObject>(options: Serializable<N>): string {
    const {node, index, isInline} = options

    if (isPortableTextToolkitList(node)) {
      return renderList(node, index)
    }

    if (isPortableTextListItemBlock(node)) {
      return renderListItem(node, index)
    }

    if (isPortableTextToolkitSpan(node)) {
      return renderSpan(node)
    }

    if (isPortableTextBlock(node)) {
      return renderBlock(node, index, isInline)
    }

    if (isPortableTextToolkitTextNode(node)) {
      return renderText(node)
    }

    return renderCustomBlock(node, index, isInline)
  }

  function renderListItem(
    node: PortableTextListItemBlock<PortableTextMarkDefinition, PortableTextSpan>,
    index: number,
  ): string {
    const tree = serializeBlock({node, index, isInline: false, renderNode})
    const renderer = components.listItem
    const handler = typeof renderer === 'function' ? renderer : renderer[node.listItem]
    const itemHandler = handler || components.unknownListItem

    if (itemHandler === components.unknownListItem) {
      const style = node.listItem || 'bullet'
      handleMissingComponent(unknownListItemStyleWarning(style), {
        type: style,
        nodeType: 'listItemStyle',
      })
    }

    let children = tree.children
    if (node.style && node.style !== 'normal') {
      // Wrap any other style in whatever the block component says to use
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {listItem, ...blockNode} = node
      children = renderNode({node: blockNode, index, isInline: false, renderNode})
    }

    return itemHandler({value: node, index, isInline: false, renderNode, children})
  }

  function renderList(node: HtmlPortableTextList, index: number): string {
    const children = node.children.map((child, childIndex) =>
      renderNode({
        node: child._key ? child : {...child, _key: `li-${index}-${childIndex}`},
        index: childIndex,
        isInline: false,
        renderNode,
      }),
    )

    const component = components.list
    const handler = typeof component === 'function' ? component : component[node.listItem]
    const list = handler || components.unknownList

    if (list === components.unknownList) {
      const style = node.listItem || 'bullet'
      handleMissingComponent(unknownListStyleWarning(style), {nodeType: 'listStyle', type: style})
    }

    return list({value: node, index, isInline: false, renderNode, children: children.join('')})
  }

  function renderSpan(node: ToolkitNestedPortableTextSpan): string {
    const {markDef, markType, markKey} = node
    const span = components.marks[markType] || components.unknownMark
    const children = node.children.map((child, childIndex) =>
      renderNode({node: child, index: childIndex, isInline: true, renderNode}),
    )

    if (span === components.unknownMark) {
      handleMissingComponent(unknownMarkWarning(markType), {nodeType: 'mark', type: markType})
    }

    return span({
      text: spanToPlainText(node),
      value: markDef,
      markType,
      markKey,
      renderNode,
      children: children.join(''),
    })
  }

  function renderBlock(node: PortableTextBlock, index: number, isInline: boolean): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {_key, ...props} = serializeBlock({node, index, isInline, renderNode})
    const style = props.node.style || 'normal'
    const handler =
      typeof components.block === 'function' ? components.block : components.block[style]
    const block = handler || components.unknownBlockStyle

    if (block === components.unknownBlockStyle) {
      handleMissingComponent(unknownBlockStyleWarning(style), {
        nodeType: 'blockStyle',
        type: style,
      })
    }

    return block({...props, value: props.node, renderNode})
  }

  function renderText(node: ToolkitTextNode): string {
    if (node.text === '\n') {
      const hardBreak = components.hardBreak
      return hardBreak ? hardBreak() : '\n'
    }

    return components.escapeHTML(node.text)
  }

  function renderCustomBlock(value: TypedObject, index: number, isInline: boolean): string {
    const node = components.types[value._type]

    if (!node) {
      handleMissingComponent(unknownTypeWarning(value._type), {
        nodeType: 'block',
        type: value._type,
      })
    }

    const component = node || components.unknownType
    return component({
      value,
      isInline,
      index,
      renderNode,
    })
  }

  return renderNode
}

function serializeBlock(options: Serializable<PortableTextBlock>): SerializedBlock {
  const {node, index, isInline, renderNode} = options
  const tree = buildMarksTree(node)
  const children = tree.map((child, i) =>
    renderNode({node: child, isInline: true, index: i, renderNode}),
  )

  return {
    _key: node._key || `block-${index}`,
    children: children.join(''),
    index,
    isInline,
    node,
  }
}

function noop() {
  // Intentional noop
}
