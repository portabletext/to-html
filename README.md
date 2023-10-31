# @portabletext/to-html

[![npm version](https://img.shields.io/npm/v/@portabletext/to-html.svg?style=flat-square)](https://www.npmjs.com/package/@portabletext/to-html)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@portabletext/to-html?style=flat-square)](https://bundlephobia.com/result?p=@portabletext/to-html)

Render [Portable Text](https://portabletext.org/) to HTML.

- Using **React**? See [@portabletext/react](https://github.com/portabletext/react-portabletext)
- Using **Svelte**? See [@portabletext/svelte](https://github.com/portabletext/svelte-portabletext)

## Installation

```
npm install --save @portabletext/to-html
```

## Basic usage

```js
import {toHTML} from '@portabletext/to-html'

console.log(
  toHTML(portableTextBlocks, {
    components: {
      /* optional object of custom components to use */
    },
  }),
)
```

## Styling the output

The rendered HTML does not have any styling applied, so you will want to either render a parent container with a class name you can target in your CSS, or pass [custom components](#customizing-components) if you want to pass specific class names.

## Customizing components

"Components" are (in this package) just functions, which receive an object of properties that contains the relevant information needed to make a decision about what to render. The return value of the component functions are plain strings containing HTML.

Default component functions are provided for all standard features of the Portable Text spec, with logical HTML defaults.

You can pass an object of component functions to use in the `components` option, both to override the defaults and to provide components for your custom content types.

The passed components will be merged with the default components.

**⚠️ IMPORTANT: Make sure you sanitize/escape the returned HTML!**

In the below examples we use the [htm](https://github.com/developit/htm) and [vhtml](https://github.com/developit/vhtml) modules to render "safe" HTML.

```js
import htm from 'htm'
import vhtml from 'vhtml'
import {toHTML, uriLooksSafe} from '@portabletext/to-html'

const html = htm.bind(vhtml)

const myPortableTextComponents = {
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
        return html`<a href="${href}" rel="${rel}">${children}</a>`
      }

      // If the URI appears unsafe, render the children (eg, text) without the link
      return children
    },
  },
}

console.log(toHTML(somePtValue, {components: myPortableTextComponents}))
```

## Available components

These are the overridable/implementable keys:

### `types`

An object of component functions that renders different types of objects that might appear both as part of the input array, or as inline objects within text blocks - eg alongside text spans.

Use the `isInline` property to check whether or not this is an inline object or a block.

The object has the shape `{typeName: ComponentFn}`, where `typeName` is the value set in individual `_type` attributes.

### `marks`

Object of component functions that renders different types of marks that might appear in spans. Marks can be either be simple "decorators" (eg emphasis, underline, italic) or full "annotations" which include associated data (eg links, references, descriptions).

If the mark is a decorator, the component function will receive a `markType` property which has the name of the decorator (eg `em`). If the mark is an annotation, it will receive both a `markType` with the associated `_type` property (eg `link`), and a `value` property with an object holding the data for this mark.

The component function also receives a `children` property that should (usually) be rendered in whatever parent container makes sense for this mark (eg `<a>`, `<em>`).

### `block`

An object of component functions that renders portable text blocks with different `style` properties. The object has the shape `{styleName: ComponentFn}`, where `styleName` is the value set in individual `style` attributes on blocks (`normal` being the default).

Can also be set to a single component function, which would handle block styles of _any_ type.

### `list`

Object of component functions used to render lists of different types (`bullet` vs `number`, for instance, which by default is `<ul>` and `<ol>`, respectively).

Note that there is no actual "list" node type in the Portable Text specification, but a series of list item blocks with the same `level` and `listItem` properties will be grouped into a virtual one inside of this library.

The property can also be set to a single component function, which would handle lists of _any_ type.

### `listItem`

Object of component functions used to render different list item styles. The object has the shape `{listItemType: ComponentFn}`, where `listItemType` is the value set in individual `listItem` attributes on blocks.

Can also be set to a single component function, which would handle list items of _any_ type.

### `hardBreak`

Component function to use for rendering "hard breaks", eg `\n` inside of text spans.

Will by default render a `<br />`. Pass `false` to render as-is (`\n`)

### `unknownMark`

Component function used when encountering a mark type there is no registered component for in the `components.marks` option.

### `unknownType`

Component function used when encountering an object type there is no registered component for in the `components.types` option.

### `unknownBlockStyle`

Component function used when encountering a block style there is no registered component for in the `components.block` option. Only used if `components.block` is an object.

### `unknownList`

Component function used when encountering a list style there is no registered component for in the `components.list` option. Only used if `components.list` is an object.

### `unknownListItem`

Component function used when encountering a list item style there is no registered component for in the `components.listItem` option. Only used if `components.listItem` is an object.

## Default components

If you override the default components but still want access to the original ones, you can access them by importing `defaultComponents`:

```ts
import {defaultComponents, toHTML, escapeHTML} from '@portabletext/to-html'

toHTML(
  [
    /* array of portable text blocks */
  ],
  {
    components: {
      marks: {
        link: ({children, value, ...rest}) => {
          const href = value.href || ''
          return href.startsWith('https://my.site/')
            ? `<a href="${escapeHTML(href)}" class="internalLink">${children}</a>`
            : defaultComponents({children, value, ...rest})
        },
      },
    },
  },
)
```

## Disabling warnings / handling unknown types

When the library encounters a block, mark, list or list item with a type that is not known (eg it has no corresponding component in the `components` property), it will by default print a console warning.

To disable this behavior, you can either pass `false` to the `onMissingComponent` property, or give it a custom function you want to use to report the error. For instance:

```jsx
import {toHTML} from '@portabletext/to-html'

toHTML(
  [
    /* array of portable text blocks */
  ],
  {onMissingComponent: false},
)

// or, pass it a function:

toHTML(
  [
    /* array of portable text blocks */
  ],
  {
    onMissingComponent: (message, options) => {
      myErrorLogger.report(message, {
        // eg `someUnknownType`
        type: options.type,

        // 'block' | 'mark' | 'blockStyle' | 'listStyle' | 'listItemStyle'
        nodeType: options.nodeType,
      })
    },
  },
)
```

## Missing links

If you find there are links that are not being rendered, it is likely because the `href` property (eg the URI) of the link is not considered "safe". This is done to prevent URIs like `javascript:someDangerousFn()` and similar from being rendered. If you want to override this behavior, provide a custom component for the `link` mark:

```js
import {escapeHTML} from `@portabletext/to-html`

toHTML(portableTextBlocks, {
  components: {
    marks: {
      link: ({children, value}) => {
        // ⚠️ `value.href` IS NOT "SAFE" BY DEFAULT ⚠️
        // ⚠️ Make sure you sanitize/validate the href! ⚠️
        const unsafeUri = value.href || ''
        const looksSafe = /^(http|https|mailto|my-custom-proto):/i.test(unsafeUri)
        return looksSafe
          ? `<a href="${escapeHTML(value.href)}">${children}</a>`
          : children
      },
    }
  },
})
```

## License

MIT © [Sanity.io](https://www.sanity.io/)
