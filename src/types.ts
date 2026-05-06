import type {ToolkitPortableTextList, ToolkitPortableTextListItem} from '@portabletext/toolkit'
import type {
  ArbitraryTypedObject,
  PortableTextBlock,
  PortableTextBlockStyle,
  PortableTextListItemBlock,
  PortableTextListItemType,
  TypedObject,
} from '@portabletext/types'

type LooseRecord<K extends string, V> = Record<string, V> & {
  [P in K]?: V // autocompleted keys
}

// ===== TypeGen Inference Helpers =====

/** Extracts the literal `_type` string from a TypedObject union member */
type TypeName<T> = T extends {_type: infer Name} ? (Name extends string ? Name : never) : never

/** Keeps only non-widened literal string members (drops `string & {}` slots) */
type BuiltInPortableTextString<T> = T extends string ? (string extends T ? never : T) : never

/** Extracts non-block custom types from the B union */
type CustomPortableTextType<B extends TypedObject> = Exclude<B, {_type: 'block'}>

/** Extracts the literal _type names of custom (non-block) types */
type CustomPortableTextTypeName<B extends TypedObject> = TypeName<CustomPortableTextType<B>>

/** Extracts the block types from the B union */
type PortableTextBlockType<B extends TypedObject> = Extract<B, {_type: 'block'}>

/** The built-in default block styles */
export type DefaultPortableTextBlockStyle = BuiltInPortableTextString<PortableTextBlockStyle>

/** Extracts the style names from block types in the B union */
type PortableTextBlockStyleName<B extends TypedObject> =
  PortableTextBlockType<B> extends {style?: infer Style}
    ? NonNullable<Style> extends string
      ? NonNullable<Style>
      : never
    : never

/** Extracts custom (non-default) block style names */
type CustomPortableTextBlockStyleName<B extends TypedObject> = Exclude<
  PortableTextBlockStyleName<B>,
  DefaultPortableTextBlockStyle
>

/** Narrows a block type to only have the specified style */
type PortableTextBlockForStyle<B extends TypedObject, Style extends string> =
  PortableTextBlockType<B> extends infer Block
    ? Block extends TypedObject
      ? Omit<Block, 'style'> & {
          style?: Extract<Block extends {style?: infer S} ? S : never, Style>
        }
      : never
    : never

/** Extracts mark definition types from markDefs arrays in blocks */
type PortableTextMarkType<B extends TypedObject> =
  PortableTextBlockType<B> extends {markDefs?: infer MarkDefs}
    ? NonNullable<MarkDefs> extends readonly (infer MarkDef)[]
      ? Extract<MarkDef, TypedObject>
      : never
    : never

/** Extracts the literal _type names of mark definitions */
type PortableTextMarkTypeName<B extends TypedObject> = TypeName<PortableTextMarkType<B>>

/** The built-in default mark types */
export type DefaultPortableTextMark =
  | 'em'
  | 'strong'
  | 'code'
  | 'underline'
  | 'strike-through'
  | 'link'

/** Extracts custom (non-default) mark type names */
type CustomPortableTextMarkTypeName<B extends TypedObject> = Exclude<
  PortableTextMarkTypeName<B>,
  DefaultPortableTextMark
>

/** Extracts list item type names from blocks */
type PortableTextListItemName<B extends TypedObject> =
  PortableTextBlockType<B> extends {listItem?: infer ListItem}
    ? NonNullable<ListItem> extends string
      ? NonNullable<ListItem>
      : never
    : never

/** The built-in default list item types */
export type DefaultPortableTextListItem = BuiltInPortableTextString<PortableTextListItemType>

/** Extracts custom (non-default) list item names */
type CustomPortableTextListItemName<B extends TypedObject> = Exclude<
  PortableTextListItemName<B>,
  DefaultPortableTextListItem
>

/** Narrows a list to a specific listItem style */
type PortableTextListForItem<ListItem extends string> = HtmlPortableTextList extends infer List
  ? List extends HtmlPortableTextList
    ? Omit<List, 'listItem'> & {listItem: ListItem}
    : never
  : never

// ===== Component Map Types (3-branch conditional pattern) =====

type PortableTextTypeComponents<B extends TypedObject> =
  string extends CustomPortableTextTypeName<B>
    ? Record<string, PortableTextTypeComponent | undefined>
    : CustomPortableTextTypeName<B> extends never
      ? Record<string, PortableTextTypeComponent | undefined>
      : Record<string, PortableTextTypeComponent | undefined> & {
          [Type in CustomPortableTextTypeName<B>]?: PortableTextTypeComponent<
            Extract<CustomPortableTextType<B>, {_type: Type}>
          >
        }

type PortableTextMarkComponents<B extends TypedObject> =
  string extends CustomPortableTextMarkTypeName<B>
    ? Record<string, PortableTextMarkComponent | undefined>
    : CustomPortableTextMarkTypeName<B> extends never
      ? Record<string, PortableTextMarkComponent | undefined>
      : Record<string, PortableTextMarkComponent | undefined> & {
          [Mark in CustomPortableTextMarkTypeName<B>]?: PortableTextMarkComponent<
            Extract<PortableTextMarkType<B>, {_type: Mark}>
          >
        }

type PortableTextBlockComponents<B extends TypedObject> =
  string extends CustomPortableTextBlockStyleName<B>
    ? LooseRecord<PortableTextBlockStyle, PortableTextBlockComponent | undefined>
    : CustomPortableTextBlockStyleName<B> extends never
      ? LooseRecord<PortableTextBlockStyle, PortableTextBlockComponent | undefined>
      : LooseRecord<PortableTextBlockStyle, PortableTextBlockComponent | undefined> & {
          [Style in CustomPortableTextBlockStyleName<B>]?: PortableTextComponent<
            PortableTextBlockForStyle<B, Style>
          >
        }

type PortableTextBlockComponentFor<B extends TypedObject> =
  PortableTextBlockType<B> extends never
    ? PortableTextBlockComponent
    : PortableTextComponent<PortableTextBlockType<B>>

type PortableTextListComponents<B extends TypedObject> =
  string extends CustomPortableTextListItemName<B>
    ? LooseRecord<PortableTextListItemType, PortableTextListComponent | undefined>
    : CustomPortableTextListItemName<B> extends never
      ? LooseRecord<PortableTextListItemType, PortableTextListComponent | undefined>
      : LooseRecord<PortableTextListItemType, PortableTextListComponent | undefined> & {
          [Item in CustomPortableTextListItemName<B>]?: PortableTextComponent<
            PortableTextListForItem<Item>
          >
        }

type PortableTextListComponentFor<_B extends TypedObject> = PortableTextListComponent

type PortableTextListItemComponents<B extends TypedObject> =
  string extends PortableTextListItemName<B>
    ? LooseRecord<PortableTextListItemType, PortableTextListItemComponent | undefined>
    : PortableTextListItemName<B> extends never
      ? LooseRecord<PortableTextListItemType, PortableTextListItemComponent | undefined>
      : LooseRecord<PortableTextListItemType, PortableTextListItemComponent | undefined>

type PortableTextListItemComponentFor<_B extends TypedObject> = PortableTextListItemComponent

// ===== Strict Component Map Types =====

type StrictPortableTextTypeComponents<B extends TypedObject> =
  string extends CustomPortableTextTypeName<B>
    ? Record<string, PortableTextTypeComponent | undefined>
    : CustomPortableTextTypeName<B> extends never
      ? Record<string, never>
      : {
          [Type in CustomPortableTextTypeName<B>]-?: PortableTextTypeComponent<
            Extract<CustomPortableTextType<B>, {_type: Type}>
          >
        }

type StrictPortableTextMarkComponents<B extends TypedObject> =
  string extends CustomPortableTextMarkTypeName<B>
    ? Record<string, PortableTextMarkComponent | undefined>
    : CustomPortableTextMarkTypeName<B> extends never
      ? Record<string, never>
      : {
          [Mark in CustomPortableTextMarkTypeName<B>]-?: PortableTextMarkComponent<
            Extract<PortableTextMarkType<B>, {_type: Mark}>
          >
        }

type StrictPortableTextBlockComponents<B extends TypedObject> =
  string extends CustomPortableTextBlockStyleName<B>
    ? LooseRecord<PortableTextBlockStyle, PortableTextBlockComponent | undefined>
    : CustomPortableTextBlockStyleName<B> extends never
      ? Record<string, never>
      : {
          [Style in CustomPortableTextBlockStyleName<B>]-?: PortableTextComponent<
            PortableTextBlockForStyle<B, Style>
          >
        }

type StrictPortableTextListComponents<B extends TypedObject> =
  string extends CustomPortableTextListItemName<B>
    ? LooseRecord<PortableTextListItemType, PortableTextListComponent | undefined>
    : CustomPortableTextListItemName<B> extends never
      ? Record<string, never>
      : {
          [Item in CustomPortableTextListItemName<B>]-?: PortableTextComponent<
            PortableTextListForItem<Item>
          >
        }

type StrictPortableTextListItemComponents<_B extends TypedObject> =
  LooseRecord<PortableTextListItemType, PortableTextListItemComponent | undefined>

type StrictPortableTextTypeComponentOverrides<B extends TypedObject> =
  CustomPortableTextTypeName<B> extends never
    ? {types?: StrictPortableTextTypeComponents<B>}
    : {types: StrictPortableTextTypeComponents<B>}

type StrictPortableTextMarkComponentOverrides<B extends TypedObject> =
  CustomPortableTextMarkTypeName<B> extends never
    ? {marks?: StrictPortableTextMarkComponents<B>}
    : {marks: StrictPortableTextMarkComponents<B>}

type StrictPortableTextBlockComponentOverrides<B extends TypedObject> =
  CustomPortableTextBlockStyleName<B> extends never
    ? {block?: StrictPortableTextBlockComponents<B> | PortableTextBlockComponentFor<B>}
    : {block: StrictPortableTextBlockComponents<B> | PortableTextBlockComponentFor<B>}

type StrictPortableTextListComponentOverrides<B extends TypedObject> =
  CustomPortableTextListItemName<B> extends never
    ? {list?: StrictPortableTextListComponents<B> | PortableTextListComponentFor<B>}
    : {list: StrictPortableTextListComponents<B> | PortableTextListComponentFor<B>}

type StrictPortableTextListItemComponentOverrides<B extends TypedObject> = {
  listItem?: StrictPortableTextListItemComponents<B> | PortableTextListItemComponentFor<B>
}

// ===== InferValue Deep-Traversal Helper =====

/** Identifies if T is a portable-text array (has a {_type:'block'} member) */
type PortableTextArrayItem<T> =
  NonNullable<T> extends readonly (infer Item)[]
    ? Extract<NonNullable<Item>, {_type: 'block'}> extends never
      ? never
      : Extract<NonNullable<Item>, TypedObject>
    : never

/** Recursively digs through nested objects/unions to find all PT array item types */
type InferPortableTextTypedObject<T> = T extends unknown
  ? PortableTextArrayItem<T> extends never
    ? NonNullable<T> extends readonly (infer Item)[]
      ? InferPortableTextTypedObject<Item>
      : NonNullable<T> extends object
        ? {
            [Key in keyof NonNullable<T>]: InferPortableTextTypedObject<NonNullable<T>[Key]>
          }[keyof NonNullable<T>]
        : never
    : PortableTextArrayItem<T>
  : never

/** Extracts the value item type from T (handles both single items and arrays) */
type PortableTextValueItem<T> = Extract<
  NonNullable<T> extends readonly (infer B)[] ? B : NonNullable<T>,
  TypedObject
>

// ===== Public Utility Types =====

/**
 * Infer a forgiving `PortableTextComponents` type from a value type.
 * All custom handlers are optional and extra handlers for unknown types are allowed.
 *
 * @example
 * ```ts
 * import type {InferComponents} from '@portabletext/to-html'
 *
 * const components = {
 *   types: {
 *     image: ({value}) => `<img src="${value.url}" />`,
 *   },
 * } satisfies InferComponents<typeof data.content>
 * ```
 */
export type InferComponents<T> = PortableTextComponents<PortableTextValueItem<T>>

/**
 * Infer a strict `PortableTextComponents` type from a value type.
 * Requires handlers for all inferred custom types, marks, block styles, and list styles.
 * Rejects handlers for types not in the value union.
 *
 * @example
 * ```ts
 * import type {InferStrictComponents} from '@portabletext/to-html'
 *
 * const components = {
 *   types: {
 *     image: ({value}) => `<img src="${value.url}" />`,
 *     code: ({value}) => `<pre><code>${value.code}</code></pre>`,
 *   },
 * } satisfies InferStrictComponents<typeof data.content>
 * ```
 */
export type InferStrictComponents<T> = Omit<
  PortableTextComponents<PortableTextValueItem<T>>,
  'types' | 'marks' | 'block' | 'list' | 'listItem'
> &
  StrictPortableTextTypeComponentOverrides<PortableTextValueItem<T>> &
  StrictPortableTextMarkComponentOverrides<PortableTextValueItem<T>> &
  StrictPortableTextBlockComponentOverrides<PortableTextValueItem<T>> &
  StrictPortableTextListComponentOverrides<PortableTextValueItem<T>> &
  StrictPortableTextListItemComponentOverrides<PortableTextValueItem<T>>

/**
 * Recursively traverses a TypeGen query result type to collect all portable text
 * array item types found anywhere in the object graph.
 *
 * @example
 * ```ts
 * import type {InferValue} from '@portabletext/to-html'
 *
 * type PortableTextValue = InferValue<PostQueryResult | AuthorQueryResult>
 * ```
 */
export type InferValue<T> = Exclude<InferPortableTextTypedObject<T>, undefined>[]

/**
 * Options for the Portable Text to HTML function
 *
 * @template B The block/inline object types expected in the portable text array
 */
export interface PortableTextOptions<B extends TypedObject = PortableTextBlock | ArbitraryTypedObject> {
  /**
   * Component functions to use for rendering
   */
  components?: PortableTextComponents<B>

  /**
   * Function to call when encountering unknown unknown types, eg blocks, marks,
   * block style, list styles without an associated component function.
   *
   * Will print a warning message to the console by default.
   * Pass `false` to disable.
   */
  onMissingComponent?: MissingComponentHandler | false
}

/**
 * Generic type for portable text components that takes blocks/inline blocks
 *
 * @template N Node types we expect to be rendering (`PortableTextBlock` should usually be part of this)
 */
export type PortableTextComponent<N> = (options: PortableTextComponentOptions<N>) => string

/**
 * Component function type for rendering portable text blocks (paragraphs, headings, blockquotes etc)
 */
export type PortableTextBlockComponent = PortableTextComponent<PortableTextBlock>

/**
 * Component function type for rendering (virtual, not part of the spec) portable text lists
 */
export type PortableTextListComponent = PortableTextComponent<HtmlPortableTextList>

/**
 * Component function type for rendering portable text list items
 */
export type PortableTextListItemComponent = PortableTextComponent<PortableTextListItemBlock>

/**
 * Component function type for rendering portable text marks and/or decorators
 *
 * @template M The mark type we expect
 */
export type PortableTextMarkComponent<M extends TypedObject = any> = (
  options: PortableTextMarkComponentOptions<M>,
) => string

export type PortableTextTypeComponent<V extends TypedObject = any> = (
  options: PortableTextTypeComponentOptions<V>,
) => string

/**
 * Object defining the different component functions to use for rendering various aspects
 * of Portable Text and user-provided types, where only the overrides needs to be provided.
 *
 * @template B The block/inline object types expected in the portable text array
 */
export type PortableTextComponents<B extends TypedObject = any> =
  Partial<PortableTextHtmlComponents<B>>

/**
 * Object definining the different component functions to use for rendering various aspects
 * of Portable Text and user-provided types.
 *
 * @template B The block/inline object types expected in the portable text array
 */
export interface PortableTextHtmlComponents<B extends TypedObject = any> {
  /**
   * Object of component functions that renders different types of objects that might appear
   * both as part of the blocks array, or as inline objects _inside_ of a block,
   * alongside text spans.
   *
   * Use the `isInline` property to check whether or not this is an inline object or a block
   *
   * The object has the shape `{typeName: ComponentFn}`, where `typeName` is the value set
   * in individual `_type` attributes.
   */
  types: PortableTextTypeComponents<B>

  /**
   * Object of component functions that renders different types of marks that might appear in spans.
   *
   * The object has the shape `{markName: ComponentFn}`, where `markName` is the value set
   * in individual `_type` attributes, values being stored in the parent blocks `markDefs`.
   */
  marks: PortableTextMarkComponents<B>

  /**
   * Object of component functions that renders blocks with different `style` properties.
   *
   * The object has the shape `{styleName: ComponentFn}`, where `styleName` is the value set
   * in individual `style` attributes on blocks.
   *
   * Can also be set to a single component function, which would handle block styles of _any_ type.
   */
  block: PortableTextBlockComponents<B> | PortableTextBlockComponentFor<B>

  /**
   * Object of component functions used to render lists of different types (bulleted vs numbered,
   * for instance, which by default is `<ul>` and `<ol>`, respectively)
   *
   * There is no actual "list" node type in the Portable Text specification, but a series of
   * list item blocks with the same `level` and `listItem` properties will be grouped into a
   * virtual one inside of this library.
   *
   * Can also be set to a single component function, which would handle lists of _any_ type.
   */
  list: PortableTextListComponents<B> | PortableTextListComponentFor<B>

  /**
   * Object of component functions used to render different list item styles.
   *
   * The object has the shape `{listItemType: ComponentFn}`, where `listItemType` is the value
   * set in individual `listItem` attributes on blocks.
   *
   * Can also be set to a single component function, which would handle list items of _any_ type.
   */
  listItem: PortableTextListItemComponents<B> | PortableTextListItemComponentFor<B>

  /**
   * Component to use for rendering "hard breaks", eg `\n` inside of text spans
   * Will by default render a `<br />`. Pass `false` to render as-is (`\n`)
   */
  hardBreak: (() => string) | false

  /**
   * Used when rendering text nodes to HTML
   */
  escapeHTML: (html: string) => string

  /**
   * Component function used when encountering a mark type there is no registered component for
   * in the `components.marks` prop.
   */
  unknownMark: PortableTextMarkComponent

  /**
   * Component function used when encountering an object type there is no registered component for
   * in the `components.types` prop.
   */
  unknownType: PortableTextComponent<UnknownNodeType>

  /**
   * Component function used when encountering a block style there is no registered component for
   * in the `components.block` prop. Only used if `components.block` is an object.
   */
  unknownBlockStyle: PortableTextComponent<PortableTextBlock>

  /**
   * Component function used when encountering a list style there is no registered component for
   * in the `components.list` prop. Only used if `components.list` is an object.
   */
  unknownList: PortableTextComponent<HtmlPortableTextList>

  /**
   * Component function used when encountering a list item style there is no registered component for
   * in the `components.listItem` prop. Only used if `components.listItem` is an object.
   */
  unknownListItem: PortableTextComponent<PortableTextListItemBlock>
}

/**
 * Options received by most Portable Text components
 *
 * @template T Type of data this component will receive in its `value` property
 */
export interface PortableTextComponentOptions<T> {
  /**
   * Data associated with this portable text node, eg the raw JSON value of a block/type
   */
  value: T

  /**
   * Index within its parent
   */
  index: number

  /**
   * Whether or not this node is "inline" - ie as a child of a text block,
   * alongside text spans, or a block in and of itself.
   */
  isInline: boolean

  /**
   * Serialized HTML of child nodes of this block/type
   */
  children?: string

  /**
   * Function used to render any node that might appear in a portable text array or block,
   * including virtual "toolkit"-nodes like lists and nested spans. You will rarely need
   * to use this.
   */
  renderNode: NodeRenderer
}

/**
 * Options received by any user-defined type in the input array that is not a text block
 *
 * @template T Type of data this component will receive in its `value` property
 */
export type PortableTextTypeComponentOptions<T> = Omit<PortableTextComponentOptions<T>, 'children'>

/**
 * Options received by Portable Text mark components
 *
 * @template M Shape describing the data associated with this mark, if it is an annotation
 */
export interface PortableTextMarkComponentOptions<M extends TypedObject = ArbitraryTypedObject> {
  /**
   * Mark definition, eg the actual data of the annotation. If the mark is a simple decorator, this will be `undefined`
   */
  value?: M

  /**
   * Text content of this mark
   */
  text: string

  /**
   * Key for this mark. The same key can be used amongst multiple text spans within the same block, so don't rely on this to be unique.
   */
  markKey?: string

  /**
   * Type of mark - ie value of `_type` in the case of annotations, or the name of the decorator otherwise - eg `em`, `italic`.
   */
  markType: string

  /**
   * Serialized HTML of child nodes of this mark
   */
  children: string

  /**
   * Function used to render any node that might appear in a portable text array or block,
   * including virtual "toolkit"-nodes like lists and nested spans. You will rarely need
   * to use this.
   */
  renderNode: NodeRenderer
}

/**
 * Any node type that we can't identify - eg it has an `_type`,
 * but we don't know anything about its other properties
 */
export type UnknownNodeType =
  | {
      _type: string
      [key: string]: unknown
    }
  | TypedObject

/**
 * Function that renders any node that might appear in a portable text array or block,
 * including virtual "toolkit"-nodes like lists and nested spans
 */
export type NodeRenderer = <T extends TypedObject>(options: Serializable<T>) => string

export type NodeType = 'block' | 'mark' | 'blockStyle' | 'listStyle' | 'listItemStyle'

export type MissingComponentHandler = (
  message: string,
  options: {type: string; nodeType: NodeType},
) => void

export interface Serializable<T> {
  node: T
  index: number
  isInline: boolean
  renderNode: NodeRenderer
}

export interface SerializedBlock {
  _key: string
  children: string
  index: number
  isInline: boolean
  node: PortableTextBlock | PortableTextListItemBlock
}

// Re-exporting these as we don't want to refer to "toolkit" outside of this module

/**
 * A virtual "list" node for Portable Text - not strictly part of Portable Text,
 * but generated by this library to ease the rendering of lists in HTML etc
 */
export type HtmlPortableTextList = ToolkitPortableTextList

/**
 * A virtual "list item" node for Portable Text - not strictly any different from a
 * regular Portable Text Block, but we can guarantee that it has a `listItem` property.
 */
export type HtmlPortableTextListItem = ToolkitPortableTextListItem
