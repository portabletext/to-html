import {escapeHTML, toHTML, type PortableTextOptions} from '@portabletext/to-html'
import type {ArbitraryTypedObject} from '@portabletext/types'
import {describe, expect, test} from 'vitest'

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

describe('escaping of unknown types/styles', () => {
  const payload = `"><img src=x onerror=alert(1)>`
  const escapedPayload = `&quot;&gt;&lt;img src=x onerror=alert(1)&gt;`

  test('escapes unknown block type', () => {
    const result = render({_type: payload, _key: 'a'})
    expect(result).toBe(
      `<div style="display:none">Unknown block type &quot;${escapedPayload}&quot;, specify a component for it in the \`components.types\` option</div>`,
    )
    expect(result).not.toContain(payload)
  })

  test('escapes unknown inline type', () => {
    const result = render({
      _type: 'block',
      _key: 'a',
      children: [{_type: payload, _key: 'b'}],
    })
    expect(result).toBe(
      `<p><span style="display:none">Unknown block type &quot;${escapedPayload}&quot;, specify a component for it in the \`components.types\` option</span></p>`,
    )
    expect(result).not.toContain(payload)
  })

  test('escapes unknown mark type', () => {
    const result = render({
      _type: 'block',
      _key: 'a',
      markDefs: [],
      children: [{_type: 'span', _key: 'b', marks: [payload], text: 'Hi'}],
    })
    expect(result).toBe(`<p><span class="unknown__pt__mark__${escapedPayload}">Hi</span></p>`)
    expect(result).not.toContain(payload)
  })

  test('escapes unknown block style', () => {
    const result = render({
      _type: 'block',
      _key: 'a',
      style: payload,
      markDefs: [],
      children: [{_type: 'span', _key: 'b', marks: [], text: 'Hi'}],
    })
    expect(result).toBe(`<p>Hi</p>`)
    expect(result).not.toContain(payload)
  })

  test('escapes unknown list style', () => {
    const result = render({
      _type: 'block',
      _key: 'a',
      listItem: payload,
      level: 1,
      markDefs: [],
      children: [{_type: 'span', _key: 'b', marks: [], text: 'Hi'}],
    })
    expect(result).toBe(`<ul><li>Hi</li></ul>`)
    expect(result).not.toContain(payload)
  })

  test('escapes unknown list item style', () => {
    const result = render(
      {
        _type: 'block',
        _key: 'a',
        listItem: payload,
        level: 1,
        markDefs: [],
        children: [{_type: 'span', _key: 'b', marks: [], text: 'Hi'}],
      },
      // The default `listItem` component is a catch-all function, so we need a
      // lookup map in order to hit the `unknownListItem` component
      {components: {listItem: {}}},
    )
    expect(result).toBe(`<ul><li>Hi</li></ul>`)
    expect(result).not.toContain(payload)
  })
})
