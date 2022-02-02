import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const server = {
  input: 'src/server.js',
  output: {
    dir: 'build',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' }), json()],
  external: [...Object.keys(pkg.dependencies), 'http', 'react-dom/server'],
};

const client = {
  input: 'src/client.js',
  output: {
    dir: 'build/public',
    format: 'iife',
    globals: { react: 'React', 'react-dom': 'ReactDOM' },
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
  external: ['react', 'react-dom'],
};

export default [server, client];
