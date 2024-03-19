import {defineConfig} from '@sanity/pkg-utils'

export default defineConfig({
  extract: {
    rules: {
      'ae-missing-release-tag': 'off',
      'tsdoc-undefined-tag': 'off',
    },
  },

  tsconfig: 'tsconfig.dist.json',

  babel: {
    plugins: ['@babel/plugin-proposal-object-rest-spread'],
  },
})
