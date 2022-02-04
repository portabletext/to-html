import tap from 'tap'
import type {ArbitraryTypedObject} from '@portabletext/types'
import type {
  PortableTextHtmlSerializers,
  PortableTextMarkSerializer,
  PortableTextOptions,
  MissingSerializerHandler,
} from '../src/types'
import {escapeHtml} from '../src'
import {toHTML} from '../src/html-portable-text'
import * as fixtures from './fixtures'

const render = (
  value: ArbitraryTypedObject | ArbitraryTypedObject[],
  options?: PortableTextOptions
) => toHTML(value, {onMissingSerializer: false, ...options})

tap.test('builds empty tree on empty block', (t) => {
  const {input, output} = fixtures.emptyBlock
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds simple one-node tree on single, markless span', (t) => {
  const {input, output} = fixtures.singleSpan
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds simple multi-node tree on markless spans', (t) => {
  const {input, output} = fixtures.multipleSpans
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds annotated span on simple mark', (t) => {
  const {input, output} = fixtures.basicMarkSingleSpan
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds annotated, joined span on adjacent, equal marks', (t) => {
  const {input, output} = fixtures.basicMarkMultipleAdjacentSpans
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds annotated, nested spans in tree format', (t) => {
  const {input, output} = fixtures.basicMarkNestedMarks
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds annotated spans with expanded marks on object-style marks', (t) => {
  const {input, output} = fixtures.linkMarkDef
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds correct structure from advanced, nested mark structure', (t) => {
  const {input, output} = fixtures.messyLinkText
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds bullet lists in parent container', (t) => {
  const {input, output} = fixtures.basicBulletList
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds numbered lists in parent container', (t) => {
  const {input, output} = fixtures.basicNumberedList
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds nested lists', (t) => {
  const {input, output} = fixtures.nestedLists
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds all basic marks as expected', (t) => {
  const {input, output} = fixtures.allBasicMarks
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('builds weirdly complex lists without any issues', (t) => {
  const {input, output} = fixtures.deepWeirdLists
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('renders all default block styles', (t) => {
  const {input, output} = fixtures.allDefaultBlockStyles
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('sorts marks correctly on equal number of occurences', (t) => {
  const {input, output} = fixtures.marksAllTheWayDown
  const marks: PortableTextHtmlSerializers['marks'] = {
    highlight: ({value, children}) =>
      `<span style="border:${value?.thickness}px solid">${children}</span>`,
  }
  const result = render(input, {serializers: {marks}})
  t.same(result, output)
  t.end()
})

tap.test('handles keyless blocks/spans', (t) => {
  const {input, output} = fixtures.keyless
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('handles empty arrays', (t) => {
  const {input, output} = fixtures.emptyArray
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('handles lists without level', (t) => {
  const {input, output} = fixtures.listWithoutLevel
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('handles inline non-span nodes', (t) => {
  const {input, output} = fixtures.inlineNodes
  const result = render(input, {
    serializers: {
      types: {
        rating: ({value}) => {
          return `<span class="rating type-${value.type} rating-${value.rating}"></span>`
        },
      },
    },
  })
  t.same(result, output)
  t.end()
})

tap.test('handles hardbreaks', (t) => {
  const {input, output} = fixtures.hardBreaks
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('can disable hardbreak serializer', (t) => {
  const {input, output} = fixtures.hardBreaks
  const result = render(input, {serializers: {hardBreak: false}})
  t.same(result, output.replace(/<br\/>/g, '\n'))
  t.end()
})

tap.test('can customize hardbreak serializer', (t) => {
  const {input, output} = fixtures.hardBreaks
  const hardBreak = () => `<br class="dat-newline"/>`
  const result = render(input, {serializers: {hardBreak}})
  t.same(result, output.replace(/<br\/>/g, '<br class="dat-newline"/>'))
  t.end()
})

tap.test('can nest marks correctly in block/marks context', (t) => {
  const {input, output} = fixtures.inlineImages
  const result = render(input, {
    serializers: {types: {image: ({value}) => `<img src="${escapeHtml(value.url)}"/>`}},
  })
  t.same(result, output)
  t.end()
})

tap.test('can render inline block with text property', (t) => {
  const {input, output} = fixtures.inlineBlockWithText
  const result = render(input, {
    serializers: {
      types: {button: (options) => `<button type="button">${options.value.text}</button>`},
    },
  })
  t.same(result, output)
  t.end()
})

tap.test('can render styled list items', (t) => {
  const {input, output} = fixtures.styledListItems
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('can render custom list item styles with fallback', (t) => {
  const {input, output} = fixtures.customListItemType
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('can render custom list item styles with provided list style serializer', (t) => {
  const {input} = fixtures.customListItemType
  const result = render(input, {
    serializers: {list: {square: ({children}) => `<ul class="list-squared">${children}</ul>`}},
  })
  t.same(
    result,
    '<ul class="list-squared"><li>Square 1</li><li>Square 2<ul><li>Dat disc</li></ul></li><li>Square 3</li></ul>'
  )
  t.end()
})

tap.test('can render custom list item styles with provided list style serializer', (t) => {
  const {input} = fixtures.customListItemType
  const result = render(input, {
    serializers: {
      listItem: {
        square: ({children}) => `<li class="item-squared">${children}</li>`,
      },
    },
  })
  t.same(
    result,
    '<ul><li class="item-squared">Square 1</li><li class="item-squared">Square 2<ul><li>Dat disc</li></ul></li><li class="item-squared">Square 3</li></ul>'
  )
  t.end()
})

tap.test('warns on missing list style serializer', (t) => {
  const {input} = fixtures.customListItemType
  const result = render(input, {
    serializers: {list: {}},
  })
  t.same(
    result,
    '<ul><li>Square 1</li><li>Square 2<ul><li>Dat disc</li></ul></li><li>Square 3</li></ul>'
  )
  t.end()
})

tap.test('can render styled list items with custom list item serializer', (t) => {
  const {input, output} = fixtures.styledListItems
  const result = render(input, {
    serializers: {
      listItem: ({children}) => `<li>${children}</li>`,
    },
  })
  t.same(result, output)
  t.end()
})

tap.test('can specify custom serializer for custom block types', (t) => {
  const {input, output} = fixtures.customBlockType
  const types: Partial<PortableTextHtmlSerializers>['types'] = {
    code: ({renderNode, ...options}) => {
      t.same(options, {
        value: {
          _key: '9a15ea2ed8a2',
          _type: 'code',
          code: input[0].code,
          language: 'javascript',
        },
        index: 0,
        isInline: false,
      })

      return `<pre data-language="${escapeHtml(options.value.language)}"><code>${escapeHtml(
        options.value.code
      )}</code></pre>`
    },
  }
  const result = render(input, {serializers: {types}})
  t.same(result, output)
  t.end()
})

tap.test('can specify custom serializers for custom marks', (t) => {
  const {input, output} = fixtures.customMarks
  const highlight: PortableTextMarkSerializer<{_type: 'highlight'; thickness: number}> = ({
    value,
    children,
  }) => `<span style="border:${value?.thickness}px solid">${children}</span>`

  const result = render(input, {serializers: {marks: {highlight}}})
  t.same(result, output)
  t.end()
})

tap.test('can specify custom serializers for defaults marks', (t) => {
  const {input, output} = fixtures.overrideDefaultMarks
  const link: PortableTextMarkSerializer<{_type: 'link'; href: string}> = ({value, children}) =>
    `<a class="mahlink" href="${value?.href}">${children}</a>`

  const result = render(input, {serializers: {marks: {link}}})
  t.same(result, output)
  t.end()
})

tap.test('falls back to default serializer for missing mark serializers', (t) => {
  const {input, output} = fixtures.missingMarkSerializer
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('can register custom `missing serializer` handler', (t) => {
  let warning = '<never called>'
  const onMissingSerializer: MissingSerializerHandler = (message) => {
    warning = message
  }

  const {input} = fixtures.missingMarkSerializer
  render(input, {onMissingSerializer: onMissingSerializer})
  t.same(
    warning,
    'Unknown mark type "abc", specify a serializer for it in the `serializers.marks` option'
  )
  t.end()
})
