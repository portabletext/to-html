import type {TypedObject} from '@portabletext/types'
import {describe, expectTypeOf, test} from 'vitest'

import type {
  DefaultPortableTextBlockStyle,
  DefaultPortableTextListItem,
  DefaultPortableTextMark,
  InferComponents,
  InferStrictComponents,
  InferValue,
  PortableTextComponents,
  PortableTextTypeComponentOptions,
} from '../src'

// ===== Test Schema Types (simulating TypeGen output) =====

interface ImageBlock {
  _type: 'image'
  _key: string
  url: string
  alt?: string
}

interface CodeBlock {
  _type: 'code'
  _key: string
  code: string
  language: string
}

interface GlossaryTermMark {
  _type: 'glossaryTerm'
  _key: string
  term: string
  definition: string
}

interface ContentBlock {
  _type: 'block'
  _key: string
  children: Array<{_type: 'span'; _key: string; text: string; marks?: string[]}>
  markDefs?: Array<GlossaryTermMark | {_type: 'link'; _key: string; href: string}>
  style?: 'normal' | 'h2' | 'h3' | 'blockquote' | 'lead'
  listItem?: 'bullet' | 'number' | 'checklist'
  level?: number
}

type PostContent = ContentBlock | ImageBlock | CodeBlock

interface PlainBlock {
  _type: 'block'
  _key: string
  children: Array<{_type: 'span'; _key: string; text: string; marks?: string[]}>
  markDefs?: Array<{_type: 'link'; _key: string; href: string}>
  style?: 'normal'
}

type AuthorBio = PlainBlock

// ===== Simulated Query Results =====

interface PostQueryResult {
  content: PostContent[] | null
}

interface AuthorQueryResult {
  bio: AuthorBio[] | null
}

// ===== Tests =====

describe('DefaultPortableTextBlockStyle', () => {
  test('includes standard block styles', () => {
    expectTypeOf<'normal'>().toMatchTypeOf<DefaultPortableTextBlockStyle>()
    expectTypeOf<'h1'>().toMatchTypeOf<DefaultPortableTextBlockStyle>()
    expectTypeOf<'h6'>().toMatchTypeOf<DefaultPortableTextBlockStyle>()
    expectTypeOf<'blockquote'>().toMatchTypeOf<DefaultPortableTextBlockStyle>()
  })
})

describe('DefaultPortableTextListItem', () => {
  test('includes standard list items', () => {
    expectTypeOf<'bullet'>().toMatchTypeOf<DefaultPortableTextListItem>()
    expectTypeOf<'number'>().toMatchTypeOf<DefaultPortableTextListItem>()
  })
})

describe('DefaultPortableTextMark', () => {
  test('includes standard marks', () => {
    expectTypeOf<'em'>().toMatchTypeOf<DefaultPortableTextMark>()
    expectTypeOf<'strong'>().toMatchTypeOf<DefaultPortableTextMark>()
    expectTypeOf<'code'>().toMatchTypeOf<DefaultPortableTextMark>()
    expectTypeOf<'underline'>().toMatchTypeOf<DefaultPortableTextMark>()
    expectTypeOf<'strike-through'>().toMatchTypeOf<DefaultPortableTextMark>()
    expectTypeOf<'link'>().toMatchTypeOf<DefaultPortableTextMark>()
  })
})

describe('InferComponents', () => {
  test('infers types component handlers from value type', () => {
    type Components = InferComponents<PostContent[]>
    type TypesMap = NonNullable<Components['types']>

    // image handler should receive ImageBlock
    expectTypeOf<NonNullable<TypesMap['image']>>().toMatchTypeOf<
      (options: PortableTextTypeComponentOptions<ImageBlock>) => string
    >()

    // code handler should receive CodeBlock
    expectTypeOf<NonNullable<TypesMap['code']>>().toMatchTypeOf<
      (options: PortableTextTypeComponentOptions<CodeBlock>) => string
    >()
  })

  test('allows unknown type handlers (forgiving)', () => {
    type Components = InferComponents<PostContent[]>
    type TypesMap = NonNullable<Components['types']>

    // Extra type handlers are allowed with `any` value
    expectTypeOf<TypesMap>().toHaveProperty('legacyEmbed')
  })

  test('all handlers are optional', () => {
    type Components = InferComponents<PostContent[]>
    // The types, marks, block, list, listItem keys are all optional in PortableTextComponents
    expectTypeOf<Components>().toMatchTypeOf<{types?: unknown}>()
    expectTypeOf<Components>().toMatchTypeOf<{marks?: unknown}>()
  })
})

describe('InferStrictComponents', () => {
  test('requires custom type handlers', () => {
    type Strict = InferStrictComponents<PostContent[]>
    // types is required because PostContent has custom types (image, code)
    expectTypeOf<Strict>().toHaveProperty('types')
  })

  test('requires custom mark handlers', () => {
    type Strict = InferStrictComponents<PostContent[]>
    // marks is required because PostContent has custom marks (glossaryTerm)
    expectTypeOf<Strict>().toHaveProperty('marks')
  })

  test('does not require types when no custom types exist', () => {
    type Strict = InferStrictComponents<AuthorBio[]>
    // AuthorBio has no custom types, so types should be optional
    expectTypeOf<{types?: Record<string, never>}>().toMatchTypeOf<Pick<Strict, 'types'>>()
  })
})

describe('InferValue', () => {
  test('extracts PT array items from query result types', () => {
    type Value = InferValue<PostQueryResult>
    // Should be an array containing the union of PT items
    expectTypeOf<Value>().toMatchTypeOf<TypedObject[]>()
  })

  test('works with union of query results', () => {
    type Value = InferValue<PostQueryResult | AuthorQueryResult>
    expectTypeOf<Value>().toMatchTypeOf<TypedObject[]>()
  })
})

describe('PortableTextComponents generic', () => {
  test('is backward compatible with non-generic usage', () => {
    // Using without type parameter should still work
    const _components: PortableTextComponents = {
      types: {
        image: ({value}) => `<img src="${(value as {url: string}).url}" />`,
      },
    }
    expectTypeOf(_components).toMatchTypeOf<PortableTextComponents>()
  })

  test('narrows type handlers with generic parameter', () => {
    type Components = PortableTextComponents<PostContent>
    type TypesMap = NonNullable<Components['types']>

    // The image key should be narrowed to ImageBlock handler
    expectTypeOf<NonNullable<TypesMap['image']>>().toMatchTypeOf<
      (options: PortableTextTypeComponentOptions<ImageBlock>) => string
    >()
  })
})
