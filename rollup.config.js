import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const extensions = ['.js', '.ts'];

const plugins = [
  babel({
    extensions,
    include: ['src/**/*']
  }),
  nodeResolve({
    extensions
  }),
  commonjs(),
  json()
];

export default [
  {
    input: './src/index.ts',
    external: ['fetch-ponyfill', 'promise-polyfill'],
    plugins,
    output: [
      {
        format: 'cjs',
        file: pkg.main
      },
      {
        format: 'esm',
        file: pkg.module
      }
    ]
  },
  {
    input: './src/index.ts',
    plugins: [
      babel({
        extensions,
        include: ['src/**/*']
      }),
      nodeResolve({
        extensions,
        browser: true
      }),
      commonjs(),
      json(),
      terser()
    ],
    output: {
      format: 'iife',
      name: 'StaticKit',
      file: 'dist/statickit.iife.js'
    }
  }
];
