const path = require('path')
const {defineConfig} = require('vite')
const dts = require('vite-dts').default
const {visualizer} = require('rollup-plugin-visualizer')
const pkg = require('./package.json')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['esm', 'cjs'],
      name: 'to-html',
      fileName: (format) => `to-html.${format}.js`,
    },
    rollupOptions: {
      external: Object.keys(pkg.dependencies),
      output: {
        // Since we publish our ./src folder, there's no point in bloating sourcemaps with another copy of it.
        sourcemapExcludeSources: true,
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts(),
    visualizer({
      filename: path.join(__dirname, 'dist', 'stats.html'),
      gzipSize: true,
      title: `${pkg.name}@${pkg.version} bundle analysis`,
    }),
  ],
})
