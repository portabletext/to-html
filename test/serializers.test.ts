import type {ArbitraryTypedObject} from '@portabletext/types'

import {type PortableTextOptions, toHTML} from '@portabletext/to-html'
import {describe, expect, test} from 'vitest'

const render = (value: ArbitraryTypedObject, options: PortableTextOptions) =>
  toHTML(value, {...options, onMissingComponent: false})

describe('serializers', () => {
  test('can override unknown mark component', () => {
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
        components: {
          unknownMark: ({children, markType}) =>
            `<span class="unknown">Unknown (${markType}): ${children}</span>`,
        },
      },
    )
    expect(result).toBe(
      '<p><span class="unknown">Unknown (unknown-deco): simple</span><span class="unknown">Unknown (unknown-mark): advanced</span></p>',
    )
  })
})
