---
'@portabletext/to-html': patch
---

fix: escape unknown type/mark names rendered by the fallback components

The default `unknownType` and `unknownMark` components embedded the node's
`_type`/mark name in their output without escaping it, so a crafted type name
could inject arbitrary HTML into the rendered output.

Low severity: it only applies when unvalidated Portable Text reaches the
renderer. Types and marks are normally checked against a known schema before
being served, which rules this out.
