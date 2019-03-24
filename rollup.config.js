import babel from 'rollup-plugin-babel';

export default {
  input: 'src/record.js',
  output: [{
    file: 'dist/record.js',
    format: 'iife',
    name: 'record'
  }, {
    file: 'dist/record.ems.js',
    format: 'es',
  }],
  plugins: [ 
    babel({
        exclude: 'node_modules/**',
        babelrc: false,
		presets: [['@babel/preset-env', { modules: false }]],
      })
   ]
};