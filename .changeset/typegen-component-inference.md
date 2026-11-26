---
'@portabletext/to-html': minor
---

Infer component types from Sanity TypeGen values

`toHTML()` now types `components` from the value it is given. With a Sanity TypeGen query result, custom types, annotation marks, block styles and list styles are autocompleted, and each component's `value` is typed from the schema. `value` also accepts `null` and `undefined`, which already rendered an empty string, so query results can be passed as-is.

New utility types: `InferValue`, `InferComponents`, `InferStrictComponents`, `DefaultPortableTextBlockStyle`, `DefaultPortableTextListItem` and `DefaultPortableTextMark`. Untyped values and existing `PortableTextComponents` / `PortableTextOptions` annotations keep working unchanged.
