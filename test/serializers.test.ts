import type {ArbitraryTypedObject} from '@portabletext/types'
import type {PortableTextOptions} from '../src'
import tap from 'tap'
import {toHTML} from '../src/html-portable-text'

const render = (value: ArbitraryTypedObject, options: PortableTextOptions) =>
  toHTML(value, {...options, onMissingSerializer: false})

tap.test('can override unknown mark serializer', (t) => {
  const result = render(
    {
      _type: 'block',
      markDefs: [{_key: 'unknown-mark', _type: 'unknown-mark'}],
      children: [
        {_type: 'span', marks: ['unknown-deco'], text: 'simple'},
        {_type: 'span', marks: ['unknown-mark'], text: 'advanced'},
      ],
    },
    {
      serializers: {
        unknownMark: ({children, markType}) =>
          `<span class="unknown">Unknown (${markType}): ${children}</span>`,
      },
    }
  )
  t.same(
    result,
    '<p><span class="unknown">Unknown (unknown-deco): simple</span><span class="unknown">Unknown (unknown-mark): advanced</span></p>'
  )
  t.end()
})
