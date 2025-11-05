import type {ArbitraryTypedObject} from '@portabletext/types'
import {describe, expect, test} from 'vitest'

import {toHTML} from '../src/to-html'
import type {PortableTextHtmlComponents, PortableTextOptions} from '../src/types'
import * as fixtures from './fixtures'

const render = (
  value: ArbitraryTypedObject | ArbitraryTypedObject[],
  options: PortableTextOptions,
) => toHTML(value, {...options, onMissingComponent: false})

describe('mutations', () => {
  test('never mutates input', () => {
    for (const [key, fixture] of Object.entries(fixtures)) {
      if (key === 'default') {
        continue
      }

      const highlight = () => `<mark />`
      const components: Partial<PortableTextHtmlComponents> = {
        marks: {highlight},
        unknownMark: ({children}) => `<span>${children}</span>`,
        unknownType: ({children}) => `<div>${children}</div>`,
      }
      const originalInput = JSON.parse(JSON.stringify(fixture.input))
      const passedInput = fixture.input
      try {
        render(passedInput, {components})
      } catch (error) {
        // ignore
      }
      expect(originalInput).toEqual(passedInput)
    }
  })
})
