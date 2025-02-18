import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const ts = typescript({
  tsconfig: 'tsconfig.json',
  tsconfigOverride: {
    rootDir: './src',
    include: ['src/**/*.ts'],
    exclude: ['node_modules', 'dist', 'cypress', 'tests'],
  },
});
const plugins = [ts, resolve(), commonjs()];

const esm = {
  input: path.join(__dirname, './src/index.esm.ts'),
  output: {
    file: pkg.module,
    format: 'esm',
  },
  plugins,
};

const ssr = {
  input: path.join(__dirname, './src/index.cjs.ts'),
  output: {
    file: pkg.main,
    format: 'cjs',
    exports: 'default',
    // name: 'ImageDropAndPaste',
  },
  plugins,
};

const iife = {
  input: path.join(__dirname, './src/index.esm.ts'),
  output: {
    file: 'dist/quill-image-drop-and-paste.js',
    name: 'QuillImageDropAndPaste',
    exports: 'named',
    format: 'iife',
  },
  plugins,
};

function generateConfig(config, withTerser = true) {
  const minConfig = {
    ...config,
  };
  minConfig.output = {
    ...config.output,
    file: withTerser ? config.output.file.replace(/\.js$/i, '.min.js') : config.output.file,
    sourcemap: withTerser,
  };
  minConfig.plugins = [...config.plugins, ...(withTerser ? [terser()] : [])];
  return [config, minConfig];
}

export default [...generateConfig(esm), ...generateConfig(ssr), ...generateConfig(iife)];
