import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import {terser} from 'rollup-plugin-terser'

function onwarn (warning, warn) {
  if (warning.code === 'CIRCULAR_DEPENDENCY') return;
  warn(warning);
}

// TODO update file paths to all be at root
export default [{
  input: 'dist/json-schema/index.js',
  name: 'primary'
},{
  input: 'dist/json-schema/frontend/index.js',
  name: 'frontend'
},{
  input: 'dist/json-schema/backend/index.js',
  name: 'backend'
}].map(bundle => ({
  input: bundle.input,
  output: [{
    dir: bundle.input.replace('/index.js', ''),
    entryFileNames: '[name].js',
    format: 'cjs'
  },{
    // When included in a browser facing app and using rollup, can't use sub folders
    dir: 'dist/json-schema',
    entryFileNames: bundle.name+'.mjs',
    format: 'es'
  }],
  plugins: [
    resolve(),
    commonjs(),
    terser(),
  ],
  onwarn,
}));