import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import { name, version, dependencies, devDependencies, peerDependencies } from './package.json';

const target = process.env.TARGET || 'es';
const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const banner = `/*
 * @license
 * ${name} v${version}
 * (c) 2018-${new Date().getFullYear()} Malash <i@malash.me>
 * Released under the MIT License.
 */`;

const config = {
  input: 'src/index.js',
  external: Object.keys(Object.assign({}, dependencies, devDependencies, peerDependencies)),
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      // .babelrc
      presets: [
        'react',
        ['es2015', { modules: false }],
        'stage-0',
      ],
      plugins: ['external-helpers'],
    }),
    commonjs(),
    filesize(),
  ],
  output: {
    banner,
    file: `dist/${name}.${target}.${isProd ? 'min.js' : 'js'}`,
    name: 'RpHoc',
    format: target,
  },
};

if (target === 'umd') {
  config.external = Object.keys(Object.assign({}, peerDependencies));
  config.plugins = [].concat(
    [resolve()],
    config.plugins,
    [replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })],
  );
}

if (isProd) {
  config.plugins = [].concat(
    config.plugins,
    [uglify({
      output: {
        comments: (node, comment) => comment.type === 'comment2' && /@preserve|@license|@cc_on/i.test(comment.value),
      },
    })],
  );
}

export default config;
