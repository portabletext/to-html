import tap from 'tap'
import type {ArbitraryTypedObject} from '@portabletext/types'
import type {PortableTextOptions} from '../src'
import {toHTML} from '../src/html-portable-text'
import * as fixtures from './fixtures'

const render = (
  value: ArbitraryTypedObject | ArbitraryTypedObject[],
  options?: PortableTextOptions
) => toHTML(value, {onMissingComponent: false, ...options})

tap.test('escapes link hrefs', (t) => {
  const {input, output} = fixtures.injectionLinkHref
  const result = render(input)
  t.same(result, output)
  t.end()
})
