import {defineConfig} from '@sanity/pkg-utils'

export default defineConfig({
  extract: {
    rules: {
      'ae-missing-release-tag': 'off',
      'tsdoc-undefined-tag': 'off',
    },
  },

  tsconfig: 'tsconfig.dist.json',
})
