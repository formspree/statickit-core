import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

const plugins = [
  babel({
    exclude: 'node_modules/**'
  }),
  nodeResolve({
    browser: true
  }),
  commonjs(),
  json()
];

export default [
  {
    input: 'src/index.js',
    plugins: plugins,
    output: {
      format: 'cjs',
      file: __dirname + '/dist/statickit.cjs.js',
      name: 'StaticKit'
    }
  },
  {
    input: 'src/index.js',
    plugins: plugins,
    output: {
      format: 'esm',
      file: __dirname + '/dist/statickit.esm.js',
      name: 'StaticKit'
    }
  }
];
