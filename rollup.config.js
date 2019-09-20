import babel from 'rollup-plugin-babel';

const plugins = [
  babel({
    exclude: 'node_modules/**'
  })
];

export default [
  {
    input: 'src/index.js',
    plugins: plugins,
    output: {
      format: 'umd',
      file: __dirname + '/dist/statickit-react.umd.js',
      name: 'StaticKit'
    }
  },
  {
    input: 'src/index.js',
    plugins: plugins,
    output: {
      format: 'esm',
      file: __dirname + '/dist/statickit-react.esm.js',
      name: 'StaticKit'
    }
  }
];
