import type {PortableTextBlock} from '@portabletext/types'

const input: PortableTextBlock = {
  _key: 'R5FvMrjo',
  _type: 'block',
  children: [
    {
      _key: '1',
      _type: 'span',
      marks: [],
      text: 'Remove ',
    },
    {
      _key: '2',
      _type: 'span',
      marks: ['jsUri'],
      text: 'this javascript:// link',
    },
    {
      _key: '3',
      _type: 'span',
      marks: [],
      text: ' but keep ',
    },
    {
      _key: '4',
      _type: 'span',
      marks: ['safeUri'],
      text: 'this one',
    },
    {
      _key: '5',
      _type: 'span',
      marks: [],
      text: ' and nuke ',
    },
    {
      _key: '6',
      _type: 'span',
      marks: ['base64Uri'],
      text: 'this base64 data uri, too',
    },
    {
      _key: '7',
      _type: 'span',
      marks: [],
      text: '. Should not allow ',
    },
    {
      _key: '8',
      _type: 'span',
      marks: ['arbitraryProtocolUri'],
      text: 'arbitrary:// links',
    },
    {
      _key: '9',
      _type: 'span',
      marks: [],
      text: '.',
    },
    {
      _key: '10',
      _type: 'span',
      marks: ['mailtoUri'],
      text: 'mailto is fine',
    },
    {
      _key: '11',
      _type: 'span',
      marks: [],
      text: ', though. ',
    },
    {
      _key: '12',
      _type: 'span',
      marks: [],
      text: 'In terms of ',
    },
    {
      _key: '13',
      _type: 'span',
      marks: ['htmlUri'],
      text: '<HTML>',
    },
    {
      _key: '14',
      _type: 'span',
      marks: [],
      text: ', it needs to ',
    },
    {
      _key: '15',
      _type: 'span',
      marks: ['breakoutUri'],
      text: 'escape the href',
    },
    {
      _key: '16',
      _type: 'span',
      marks: [],
      text: ' to prevent "breaking out" of the <a>.',
    },
  ],
  markDefs: [
    {
      _type: 'link',
      _key: 'jsUri',
      href: 'javascript:alert("no this shouldnt execute")',
    },
    {
      _type: 'link',
      _key: 'safeUri',
      href: 'https://my.site/javascript:alert("no this shouldnt execute")',
    },
    {
      _type: 'link',
      _key: 'base64Uri',
      href: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgiSGkiKTwvc2NyaXB0Pgo=',
    },
    {
      _type: 'link',
      _key: 'arbitraryProtocolUri',
      href: 'pt://my-block',
    },
    {
      _type: 'link',
      _key: 'mailtoUri',
      href: 'mailto:hello@portabletext.org',
    },
    {
      _type: 'link',
      _key: 'htmlUri',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement',
    },
    {
      _type: 'link',
      _key: 'breakoutUri',
      href: '"></a><h1 attr="',
    },
  ],
  style: 'normal',
}

export default {
  input,
  output:
    '<p>Remove this javascript:// link but keep <a href="https://my.site/javascript:alert(&quot;no this shouldnt execute&quot;)">this one</a> and nuke this base64 data uri, too. Should not allow arbitrary:// links.<a href="mailto:hello@portabletext.org">mailto is fine</a>, though. In terms of <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">&lt;HTML&gt;</a>, it needs to <a href="&quot;&gt;&lt;/a&gt;&lt;h1 attr=&quot;">escape the href</a> to prevent &quot;breaking out&quot; of the &lt;a&gt;.</p>',
}
