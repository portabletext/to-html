---
"@portabletext/to-html": patch
---

feat: ability to customize text node escaping
Add support for passing a custom `escapeHTML` function with the components.

Also add `&nbsp;` characters to the output when there are multiple consecutive spaces in the text.
