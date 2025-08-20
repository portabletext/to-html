import type {ArbitraryTypedObject} from '@portabletext/types'
import tap from 'tap'

import {escapeHTML, type PortableTextOptions} from '../src'
import {toHTML} from '../src/to-html'
import * as fixtures from './fixtures'

const render = (
  value: ArbitraryTypedObject | ArbitraryTypedObject[],
  options?: PortableTextOptions,
) => toHTML(value, {onMissingComponent: false, ...options})

tap.test('escapes link hrefs', (t) => {
  const {input, output} = fixtures.injectionLinkHref
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('preserves multiple spaces', (t) => {
  const {input, output} = fixtures.multipleSpaces
  const result = render(input)
  t.same(result, output)
  t.end()
})

tap.test('supports custom escaping', (t) => {
  const {input, output} = fixtures.customEscapeHTML
  const result = render(input, {
    components: {
      escapeHTML: (text: string) =>
        escapeHTML(text).replaceAll(/’/g, '&rsquo;').replaceAll(/é/g, '&eacute;'),
    },
  })
  t.same(result, output)
  t.end()
})
