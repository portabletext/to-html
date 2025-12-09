/* eslint-disable @typescript-eslint/no-unused-vars */
import type {ArbitraryTypedObject} from '@portabletext/types'

import {describe, expect, test} from 'vitest'

import type {
  MissingComponentHandler,
  PortableTextHtmlComponents,
  PortableTextMarkComponent,
  PortableTextOptions,
} from '../src/types'

import {escapeHTML} from '../src'
import {toHTML} from '../src/to-html'
import * as fixtures from './fixtures'

const render = (
  value: ArbitraryTypedObject | ArbitraryTypedObject[],
  options?: PortableTextOptions,
) => toHTML(value, {onMissingComponent: false, ...options})

describe('portable-text', () => {
  test('builds empty tree on empty block', () => {
    const {input, output} = fixtures.emptyBlock
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds simple one-node tree on single, markless span', () => {
    const {input, output} = fixtures.singleSpan
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds simple multi-node tree on markless spans', () => {
    const {input, output} = fixtures.multipleSpans
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds annotated span on simple mark', () => {
    const {input, output} = fixtures.basicMarkSingleSpan
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds annotated, joined span on adjacent, equal marks', () => {
    const {input, output} = fixtures.basicMarkMultipleAdjacentSpans
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds annotated, nested spans in tree format', () => {
    const {input, output} = fixtures.basicMarkNestedMarks
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds annotated spans with expanded marks on object-style marks', () => {
    const {input, output} = fixtures.linkMarkDef
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds correct structure from advanced, nested mark structure', () => {
    const {input, output} = fixtures.messyLinkText
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds bullet lists in parent container', () => {
    const {input, output} = fixtures.basicBulletList
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds numbered lists in parent container', () => {
    const {input, output} = fixtures.basicNumberedList
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds nested lists', () => {
    const {input, output} = fixtures.nestedLists
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds all basic marks as expected', () => {
    const {input, output} = fixtures.allBasicMarks
    const result = render(input)
    expect(result).toBe(output)
  })

  test('builds weirdly complex lists without any issues', () => {
    const {input, output} = fixtures.deepWeirdLists
    const result = render(input)
    expect(result).toBe(output)
  })

  test('renders all default block styles', () => {
    const {input, output} = fixtures.allDefaultBlockStyles
    const result = render(input)
    expect(result).toBe(output)
  })

  test('sorts marks correctly on equal number of occurences', () => {
    const {input, output} = fixtures.marksAllTheWayDown
    const marks: PortableTextHtmlComponents['marks'] = {
      highlight: ({value, children}) =>
        `<span style="border:${value?.thickness}px solid">${children}</span>`,
    }
    const result = render(input, {components: {marks}})
    expect(result).toBe(output)
  })

  test('handles keyless blocks/spans', () => {
    const {input, output} = fixtures.keyless
    const result = render(input)
    expect(result).toBe(output)
  })

  test('handles empty arrays', () => {
    const {input, output} = fixtures.emptyArray
    const result = render(input)
    expect(result).toBe(output)
  })

  test('handles lists without level', () => {
    const {input, output} = fixtures.listWithoutLevel
    const result = render(input)
    expect(result).toBe(output)
  })

  test('handles inline non-span nodes', () => {
    const {input, output} = fixtures.inlineNodes
    const result = render(input, {
      components: {
        types: {
          rating: ({value}) => {
            return `<span class="rating type-${value.type} rating-${value.rating}"></span>`
          },
        },
      },
    })
    expect(result).toBe(output)
  })

  test('handles hardbreaks', () => {
    const {input, output} = fixtures.hardBreaks
    const result = render(input)
    expect(result).toBe(output)
  })

  test('can disable hardbreak component', () => {
    const {input, output} = fixtures.hardBreaks
    const result = render(input, {components: {hardBreak: false}})
    expect(result).toBe(output.replace(/<br\/>/g, '\n'))
  })

  test('can customize hardbreak component', () => {
    const {input, output} = fixtures.hardBreaks
    const hardBreak = () => `<br class="dat-newline"/>`
    const result = render(input, {components: {hardBreak}})
    expect(result).toBe(output.replace(/<br\/>/g, '<br class="dat-newline"/>'))
  })

  test('can nest marks correctly in block/marks context', () => {
    const {input, output} = fixtures.inlineImages
    const result = render(input, {
      components: {types: {image: ({value}) => `<img src="${escapeHTML(value.url)}"/>`}},
    })
    expect(result).toBe(output)
  })

  test('can render inline block with text property', () => {
    const {input, output} = fixtures.inlineBlockWithText
    const result = render(input, {
      components: {
        types: {button: (options) => `<button type="button">${options.value.text}</button>`},
      },
    })
    expect(result).toBe(output)
  })

  test('can render styled list items', () => {
    const {input, output} = fixtures.styledListItems
    const result = render(input)
    expect(result).toBe(output)
  })

  test('can render custom list item styles with fallback', () => {
    const {input, output} = fixtures.customListItemType
    const result = render(input)
    expect(result).toBe(output)
  })

  test('correctly number list items', () => {
    const {input, output} = fixtures.listsWithNumbering
    const result = render(input, {
      components: {
        listItem: ({children, index, value}) => {
          const level = value?.level || 0
          return `<li class="level-${level}">${index + 1}. ${children}</li>`
        },
      },
    })
    expect(result).toBe(output)
  })

  test('can render custom list item styles with provided list style component', () => {
    const {input} = fixtures.customListItemType
    const result = render(input, {
      components: {list: {square: ({children}) => `<ul class="list-squared">${children}</ul>`}},
    })
    expect(result).toBe(
      '<ul class="list-squared"><li>Square 1</li><li>Square 2<ul><li>Dat disc</li></ul></li><li>Square 3</li></ul>',
    )
  })

  test('can render custom list item styles with provided list style component', () => {
    const {input} = fixtures.customListItemType
    const result = render(input, {
      components: {
        listItem: {
          square: ({children}) => `<li class="item-squared">${children}</li>`,
        },
      },
    })
    expect(result).toBe(
      '<ul><li class="item-squared">Square 1</li><li class="item-squared">Square 2<ul><li>Dat disc</li></ul></li><li class="item-squared">Square 3</li></ul>',
    )
  })

  test('warns on missing list style component', () => {
    const {input} = fixtures.customListItemType
    const result = render(input, {
      components: {list: {}},
    })
    expect(result).toBe(
      '<ul><li>Square 1</li><li>Square 2<ul><li>Dat disc</li></ul></li><li>Square 3</li></ul>',
    )
  })

  test('can render styled list items with custom list item component', () => {
    const {input, output} = fixtures.styledListItems
    const result = render(input, {
      components: {
        listItem: ({children}) => `<li>${children}</li>`,
      },
    })
    expect(result).toBe(output)
  })

  test('can specify custom component for custom block types', () => {
    const {input, output} = fixtures.customBlockType
    const types: Partial<PortableTextHtmlComponents>['types'] = {
      code: ({renderNode, ...options}) => {
        expect(options).toEqual({
          value: {
            _key: '9a15ea2ed8a2',
            _type: 'code',
            code: input[0]?.['code'],
            language: 'javascript',
          },
          index: 0,
          isInline: false,
        })

        return `<pre data-language="${escapeHTML(options.value.language)}"><code>${escapeHTML(
          options.value.code,
        )}</code></pre>`
      },
    }
    const result = render(input, {components: {types}})
    expect(result).toBe(output)
  })

  test('can specify custom components for custom marks', () => {
    const {input, output} = fixtures.customMarks
    const highlight: PortableTextMarkComponent<{_type: 'highlight'; thickness: number}> = ({
      value,
      children,
    }) => `<span style="border:${value?.thickness}px solid">${children}</span>`

    const result = render(input, {components: {marks: {highlight}}})
    expect(result).toBe(output)
  })

  test('can specify custom components for defaults marks', () => {
    const {input, output} = fixtures.overrideDefaultMarks
    const link: PortableTextMarkComponent<{_type: 'link'; href: string}> = ({value, children}) =>
      `<a class="mahlink" href="${value?.href}">${children}</a>`

    const result = render(input, {components: {marks: {link}}})
    expect(result).toBe(output)
  })

  test('falls back to default component for missing mark components', () => {
    const {input, output} = fixtures.missingMarkComponent
    const result = render(input)
    expect(result).toBe(output)
  })

  test('can register custom `missing component` handler', () => {
    let warning = '<never called>'
    const onMissingComponent: MissingComponentHandler = (message) => {
      warning = message
    }

    const {input} = fixtures.missingMarkComponent
    render(input, {onMissingComponent: onMissingComponent})
    expect(warning).toBe(
      'Unknown mark type "abc", specify a component for it in the `components.marks` option',
    )
  })
})
