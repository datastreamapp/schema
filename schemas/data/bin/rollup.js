import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import {terser} from 'rollup-plugin-terser'

function onwarn (warning, warn) {
  if (warning.code === 'CIRCULAR_DEPENDENCY') return;
  warn(warning);
}

export default [{
  input: 'primary/index.js',
  name: 'primary'
},{
  input: 'frontend/index.js',
  name: 'frontend'
},{
  input: 'backend/index.js',
  name: 'backend'
},{
  input: 'quality-control/index.js',
  name: 'quality-control'
}].map(bundle => ({
  input: bundle.input,
  output: [{
    // When included in a browser facing app and using rollup, can't use sub folders
    dir: bundle.input.replace('/index.js', ''),
    entryFileNames: '[name].mjs',
    format: 'es'
  },{
    dir: bundle.input.replace('/index.js', ''),
    entryFileNames: '[name].js',
    format: 'cjs'
  }],
  plugins: [
    resolve(),
    commonjs(),
    terser(),
  ],
  onwarn,
}));