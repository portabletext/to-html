import type {PortableTextBlock} from '@portabletext/types'

const input: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: '67bc3b70ed15',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: '48654e04fc30',
        text: 'level 1, item 1',
        marks: [],
      },
    ],
    level: 1,
    listItem: 'bullet',
  },
  {
    _type: 'block',
    children: [
      {
        _type: 'span',
        text: 'level 1, item 2',
        marks: [],
        _key: '846c462e23e3',
      },
    ],
    markDefs: [],
    listItem: 'bullet',
    level: 1,
    style: 'normal',
    _key: 'c550b23bbed2',
  },
  {
    _type: 'block',
    children: [
      {
        _type: 'span',
        text: 'level 2, item 1',
        marks: [],
        _key: 'c7eb8ed52704',
      },
    ],
    markDefs: [],
    listItem: 'bullet',
    level: 2,
    style: 'normal',
    _key: '0b77c0e0057b',
  },
  {
    _type: 'block',
    children: [
      {
        _type: 'span',
        text: 'level 2, item 2',
        marks: [],
        _key: '34800556b939',
      },
    ],
    markDefs: [],
    listItem: 'bullet',
    level: 2,
    style: 'normal',
    _key: '7dc7705bfb23',
  },
  {
    _type: 'block',
    children: [
      {
        _type: 'span',
        text: 'level 1, item 3',
        marks: [],
        _key: '6e4173ff8e36',
      },
    ],
    markDefs: [],
    listItem: 'bullet',
    level: 1,
    style: 'normal',
    _key: 'd0e1ab5f3839',
  },
]

export default {
  input,
  output: [
    '<ul>',
    '<li class="level-1">1. level 1, item 1</li>',
    '<li class="level-1">',
    '2. level 1, item 2',
    '<ul>',
    '<li class="level-2">1. level 2, item 1</li>',
    '<li class="level-2">2. level 2, item 2</li>',
    '</ul>',
    '</li>',
    '<li class="level-1">3. level 1, item 3</li>',
    '</ul>',
  ].join(''),
}
