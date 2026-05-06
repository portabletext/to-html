---
'@portabletext/to-html': minor
---

Added TypeGen support with new utility types: `InferComponents`, `InferStrictComponents`, `InferValue`, `DefaultPortableTextBlockStyle`, `DefaultPortableTextListItem`, and `DefaultPortableTextMark`. The `PortableTextHtmlComponents`, `PortableTextComponents`, and `PortableTextOptions` types are now generic, allowing type inference to flow from the `value` parameter through to component handlers.
