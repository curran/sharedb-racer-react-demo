import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

const config = {
  input: 'src/server.js',
  output: {
    dir: 'build',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
  external: [...Object.keys(pkg.dependencies), 'http', 'react-dom/server'],
};

export default config;
