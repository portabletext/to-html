import type {PortableTextBlock} from '@portabletext/types'

const input: PortableTextBlock = {
  _key: 'R5FvMrjo',
  _type: 'block',
  children: [
    {
      _key: 'cZUQGmh4',
      _type: 'span',
      marks: [],
      text: 'Multiple spaces in a row     should    be preserved in html output.',
    },
  ],
  markDefs: [],
  style: 'normal',
}

export default {
  input,
  output:
    '<p>Multiple spaces in a row&nbsp;&nbsp;&nbsp;&nbsp; should&nbsp;&nbsp;&nbsp; be preserved in html output.</p>',
}
