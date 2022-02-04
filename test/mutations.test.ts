import tap from 'tap'
import type {ArbitraryTypedObject} from '@portabletext/types'
import type {PortableTextHtmlSerializers, PortableTextOptions} from '../src/types'
import {toHTML} from '../src/html-portable-text'
import * as fixtures from './fixtures'

const render = (
  value: ArbitraryTypedObject | ArbitraryTypedObject[],
  options: PortableTextOptions
) => toHTML(value, {...options, onMissingSerializer: false})

tap.test('never mutates input', (t) => {
  for (const [key, fixture] of Object.entries(fixtures)) {
    if (key === 'default') {
      continue
    }

    const highlight = () => `<mark />`
    const serializers: Partial<PortableTextHtmlSerializers> = {
      marks: {highlight},
      unknownMark: ({children}) => `<span>${children}</span>`,
      unknownType: ({children}) => `<div>${children}</div>`,
    }
    const originalInput = JSON.parse(JSON.stringify(fixture.input))
    const passedInput = fixture.input
    try {
      render(passedInput, {serializers})
    } catch (error) {
      // ignore
    }
    t.same(originalInput, passedInput)
  }

  t.end()
})
