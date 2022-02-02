import tap from 'tap'
import {toHTML} from '../src/html-portable-text'
import {ArbitraryTypedObject, PortableTextOptions} from '../src/types'
import * as fixtures from './fixtures'

const render = (
  value: ArbitraryTypedObject | ArbitraryTypedObject[],
  options?: PortableTextOptions
) => toHTML(value, {onMissingSerializer: false, ...options})

tap.test('escapes link hrefs', (t) => {
  const {input, output} = fixtures.injectionLinkHref
  const result = render(input)
  t.same(result, output)
  t.end()
})
