import type {ArbitraryTypedObject} from '@portabletext/types'

import {describe, expect, test} from 'vitest'

import {escapeHTML, type PortableTextOptions} from '../src'
import {toHTML} from '../src/to-html'
import * as fixtures from './fixtures'

const render = (
  value: ArbitraryTypedObject | ArbitraryTypedObject[],
  options?: PortableTextOptions,
) => toHTML(value, {onMissingComponent: false, ...options})

describe('escaping', () => {
  test('escapes link hrefs', () => {
    const {input, output} = fixtures.injectionLinkHref
    const result = render(input)
    expect(result).toBe(output)
  })

  test('preserves multiple spaces', () => {
    const {input, output} = fixtures.multipleSpaces
    const result = render(input)
    expect(result).toBe(output)
  })

  test('supports custom escaping', () => {
    const {input, output} = fixtures.customEscapeHTML
    const result = render(input, {
      components: {
        escapeHTML: (text: string) =>
          escapeHTML(text).replaceAll(/’/g, '&rsquo;').replaceAll(/é/g, '&eacute;'),
      },
    })
    expect(result).toBe(output)
  })
})
