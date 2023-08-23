<!-- markdownlint-disable --><!-- textlint-disable -->

# 📓 Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.2](https://github.com/portabletext/to-html/compare/v2.0.1...v2.0.2) (2023-08-23)

### Bug Fixes

- add provenance ([27ff7a8](https://github.com/portabletext/to-html/commit/27ff7a8f8dd2879c5ee5b2baa53c48fec3d480c1))

## [2.0.1](https://github.com/portabletext/to-html/compare/v2.0.0...v2.0.1) (2023-08-23)

### Bug Fixes

- **esm:** add `node.module` condition ([#22](https://github.com/portabletext/to-html/issues/22)) ([9676248](https://github.com/portabletext/to-html/commit/9676248e5bc6dc8aec85e3dcc0a2853591ffa5d4))

## [2.0.0](https://github.com/portabletext/to-html/compare/v1.0.4...v2.0.0) (2023-02-17)

### ⚠ BREAKING CHANGES

- Only node 14.13.1 and higher is now supported.
- ESM/CommonJS compatibility is now improved, but may cause new behavior
  in certain contexts. It should however be more forward-compatible, and allow usage in
  a wider range of tools and environments.

ADDED: Semantic release automation

ADDED: Use @sanity/pkg-utils instead of vite directly, for better control of bundling

### Features

- improve ESM/CJS compatibility, drop support for node 12 ([#5](https://github.com/portabletext/to-html/issues/5)) ([aabcfb5](https://github.com/portabletext/to-html/commit/aabcfb538586943d834a6b87f5572f23e8942fb1))
