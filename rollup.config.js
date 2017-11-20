import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/Canvas.js',
  format: 'umd',
  moduleName: 'Painter',
  plugins: [
    babel({
      babelrc: true,
      comments: true,
      runtimeHelpers: true
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs()
  ],
  dest: 'dist/painter.js'
}
