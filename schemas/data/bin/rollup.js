// import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

function onwarn (warning, warn) {
  if (warning.code === 'CIRCULAR_DEPENDENCY') return
  warn(warning)
}

export default ['primary', 'frontend', 'backend', 'quality-control'].map(
  (name) => ({
    input: `${name}/index.js`,
    output: [
      {
        // When included in a browser facing app and using rollup, can't use sub folders
        dir: name,
        entryFileNames: '[name].js',
        format: 'es'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      esbuild({
        minify: true,
        target: 'es2020', // nodejs14
        legalComments: 'none',
        sourcesContent: false
      })
    ],
    onwarn
  })
)
