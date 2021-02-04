//import json from '@rollup/plugin-json'
// import globals from 'rollup-plugin-node-globals'
import resolve from '@rollup/plugin-node-resolve'
// import builtins from 'rollup-plugin-node-builtins'
import commonjs from '@rollup/plugin-commonjs'
// import autoNamedExports from 'rollup-plugin-auto-named-exports'
import {terser} from 'rollup-plugin-terser'

function onwarn (warning, warn) {
  if (warning.code === 'CIRCULAR_DEPENDENCY') return;
  warn(warning);
}

export default [{
  input: 'dist/json-schema/index.js',
},{
  input: 'dist/json-schema/frontend/index.js',
},{
  input: 'dist/json-schema/backend/index.js',
}].map(bundle => ({
  input: bundle.input,
  output: [{
    dir: bundle.input.replace('/index.js', ''),
    entryFileNames: '[name].js',
    format: 'cjs'
  },{
    dir: bundle.input.replace('/index.js', ''),
    entryFileNames: '[name].mjs',
    format: 'es'
  }],
  plugins: [
    //babel(),
    //json(),
    //builtins(),	// Polyfill node
    resolve(/*{
      mainFields:['module', 'main','browser'],
      browser:true
    }*/),	//
    commonjs(),	// For PapaParse & schema
    //autoNamedExports(),
    //globals(),
    terser(),
  ],
  onwarn,
}));