import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser' // TODO esbuild

function onwarn (warning, warn) {
  if (warning.code === 'CIRCULAR_DEPENDENCY') return
  warn(warning)
}

export default ['primary', 'frontend', 'backend', 'quality-control']
  .map(name => ({
    input: `${name}/index.js`,
    output: [{
      // When included in a browser facing app and using rollup, can't use sub folders
      dir: name,
      entryFileNames: '[name].mjs',
      format: 'es'
    }, {
      dir: name,
      entryFileNames: '[name].js',
      format: 'cjs'
    }],
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ],
    onwarn,
  }))