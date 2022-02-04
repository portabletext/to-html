# @portabletext/html

[![npm version](https://img.shields.io/npm/v/@portabletext/html.svg?style=flat-square)](https://www.npmjs.com/package/@portabletext/html)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@portabletext/html?style=flat-square)](https://bundlephobia.com/result?p=@portabletext/html)[![Build Status](https://img.shields.io/github/workflow/status/portabletext/html-portabletext/test/main.svg?style=flat-square)](https://github.com/portabletext/html-portabletext/actions?query=workflow%3Atest)

Render [Portable Text](https://portabletext.org/) to HTML.

## Installation

```
npm install --save @portabletext/html
```

## Basic usage

```js
import {toHTML} from '@portabletext/html'

console.log(
  toHTML(portableTextBlocks, {
    serializers: {
      /* optional object of custom serializers to use */
    },
  })
)
```

## Styling the output

The rendered HTML does not have any styling applied, so you will want to either render a parent container with a class name you can target in your CSS, or pass [custom serializers](#customizing-serializers) if you want to pass specific class names.

## Customizing serializers

Default serializer functions are provided for all standard features of the Portable Text spec, with logical HTML defaults.

You can pass an object of serializer functions to use in the `serializers` option, both to override the defaults and to provide serializers for your custom content types.

The passed serializers will be merged with the default serializers.

**⚠️ IMPORTANT: Make sure you sanitize/escape the returned HTML!**

In the below examples we use the [htm](https://github.com/developit/htm) and [vhtml](https://github.com/developit/vhtml) modules to render "safe" HTML.

```js
import htm from 'htm'
import vhtml from 'vhtml'
import {toHTML, uriLooksSafe} from '@portabletext/html'

const html = htm.bind(vhtml)

const myPortableTextSerializers = {
  types: {
    image: ({value}) => html`<img src="${value.imageUrl}" />`,
    callToAction: ({value, isInline}) =>
      isInline
        ? html`<a href="${value.url}">${value.text}</a>`
        : html`<div class="callToAction">${value.text}</div>`,
  },

  marks: {
    link: ({children, value}) => {
      // ⚠️ `value.href` IS NOT "SAFE" BY DEFAULT ⚠️
      // ⚠️ Make sure you sanitize/validate the href! ⚠️
      const href = value.href || ''

      if (uriLooksSafe(href)) {
        const rel = href.startsWith('/') ? undefined : 'noreferrer noopener'
        return html`<a href="${value.href}" rel="${rel}">${children}</a>`
      }

      // If the URI appears unsafe, render the children (eg, text) without the link
      return children
    },
  },
}

console.log(toHTML(somePtValue, {serializers: myPortableTextSerializers}))
```

## Available serializers

These are the overridable/implementable keys:

### `types`

An object of serializer functions that renders different types of objects that might appear both as part of the input array, or as inline objects within text blocks - eg alongside text spans.

Use the `isInline` property to check whether or not this is an inline object or a block.

The object has the shape `{typeName: SerializerFn}`, where `typeName` is the value set in individual `_type` attributes.

### `marks`

Object of serializer functions that renders different types of marks that might appear in spans. Marks can be either be simple "decorators" (eg emphasis, underline, italic) or full "annotations" which include associated data (eg links, references, descriptions).

If the mark is a decorator, the serializer function will receive a `markType` property which has the name of the decorator (eg `em`). If the mark is an annotation, it will receive both a `markType` with the associated `_type` property (eg `link`), and a `value` property with an object holding the data for this mark.

The serializer function also receives a `children` property that should (usually) be rendered in whatever parent container makes sense for this mark (eg `<a>`, `<em>`).

### `block`

An object of serializer functions that renders portable text blocks with different `style` properties. The object has the shape {styleName: SerializerFn}`, where `styleName`is the value set in individual `style` attributes on blocks (`normal` being the default).

Can also be set to a single serializer function, which would handle block styles of _any_ type.

### `list`

Object of serializer functions used to render lists of different types (`bullet` vs `number`, for instance, which by default is `<ul>` and `<ol>`, respectively).

Note that there is no actual "list" node type in the Portable Text specification, but a series of list item blocks with the same `level` and `listItem` properties will be grouped into a virtual one inside of this library.

The property can also be set to a single serializer function, which would handle lists of _any_ type.

### `listItem`

Object of serializer functions used to render different list item styles. The object has the shape `{listItemType: SerializerFn}`, where `listItemType` is the value set in individual `listItem` attributes on blocks.

Can also be set to a single serializer function, which would handle list items of _any_ type.

### `hardBreak`

Serializer function to use for rendering "hard breaks", eg `\n` inside of text spans.

Will by default render a `<br />`. Pass `false` to render as-is (`\n`)

### `unknownMark`

Serializer function used when encountering a mark type there is no registered serializer for in the `serializers.marks` option.

### `unknownType`

Serializer function used when encountering an object type there is no registered serializer for in the `serializers.types` option.

### `unknownBlockStyle`

Serializer function used when encountering a block style there is no registered serializer for in the `serializers.block` option. Only used if `serializers.block` is an object.

### `unknownList`

Serializer function used when encountering a list style there is no registered serializer for in the `serializers.list` option. Only used if `serializers.list` is an object.

### `unknownListItem`

Serializer function used when encountering a list item style there is no registered serializer for in the `serializers.listItem` option. Only used if `serializers.listItem` is an object.

## Disabling warnings / handling unknown types

When the library encounters a block, mark, list or list item with a type that is not known (eg it has no corresponding serializer in the `serializers` property), it will by default print a console warning.

To disable this behavior, you can either pass `false` to the `onMissingSerializer` property, or give it a custom function you want to use to report the error. For instance:

```jsx
import {toHTML} from '@portabletext/html'

toHTML(
  [
    /* array of portable text blocks */
  ],
  {onMissingSerializer: false}
)

// or, pass it a function:

toHTML(
  [
    /* array of portable text blocks */
  ],
  {
    onMissingSerializer: (message, options) => {
      myErrorLogger.report(message, {
        // eg `someUnknownType`
        type: options.type,

        // 'block' | 'mark' | 'blockStyle' | 'listStyle' | 'listItemStyle'
        nodeType: options.nodeType,
      })
    },
  }
)
```

## Missing links

If you find there are links that are not being rendered, it is likely because the `href` property (eg the URI) of the link is not considered "safe". This is done to prevent URIs like `javascript:someDangerousFn()` and similar from being rendered. If you want to override this behavior, provide a custom serializer for the `link` mark:

```js
import {escapeHtml} from `@portabletext/html`

toHTML(portableTextBlocks, {
  serializers: {
    marks: {
      link: ({children, value}) => {
        // ⚠️ `value.href` IS NOT "SAFE" BY DEFAULT ⚠️
        // ⚠️ Make sure you sanitize/validate the href! ⚠️
        const unsafeUri = value.href || ''
        const looksSafe = /^(http|https|mailto|my-custom-proto):/i.test(unsafeUri)
        return looksSafe
          ? `<a href="${escapeHtml(value.href)}">${children}</a>`
          : children
      },
    }
  },
})
```

## License

MIT © [Sanity.io](https://www.sanity.io/)
