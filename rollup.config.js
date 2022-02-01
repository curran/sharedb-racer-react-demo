import { babel } from '@rollup/plugin-babel';

const config = {
  input: 'src/server.js',
  output: {
    dir: 'build',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
  external: ['express', 'react', 'react-dom/server'],
};

export default config;
