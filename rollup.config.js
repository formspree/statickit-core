import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const plugins = [
  babel({
    exclude: 'node_modules/**'
  }),
  nodeResolve({
    browser: true
  }),
  commonjs()
];

export default [
  {
    input: 'src/index.js',
    plugins: plugins,
    output: {
      format: 'umd',
      file: __dirname + '/dist/statickit.umd.js',
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
