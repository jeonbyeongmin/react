import type { RollupOptions } from 'rollup';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

/**
 * config
 */

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const configs: RollupOptions[] = [
  ...generateConfig({
    packageDir: 'packages/react',
    entry: 'src/index.ts',
  }),
];

export default configs;

/**
 * helpers
 */

type Options = {
  packageDir: string;
  entry: string | string[];
};

function generateBuilder(format: 'cjs' | 'esm'): (opts: Options) => RollupOptions {
  return (opts: Options) => {
    const entries = Array.isArray(opts.entry) ? opts.entry : [opts.entry];
    const input = entries.map(entry => `${opts.packageDir}/${entry}`);

    return {
      input,
      output: {
        dir: `${opts.packageDir}/${format}`,
        format,
        exports: 'named',
        sourcemap: true,
      },
      plugins: [
        resolve({
          extensions,
        }),
        commonjs(),
        babel({
          extensions,
          babelHelpers: 'bundled',
          exclude: 'node_modules/**',
        }),
      ],
    };
  };
}

const buildCJS = generateBuilder('cjs');
const buildESM = generateBuilder('esm');

function generateConfig(opts: Options) {
  return [buildCJS(opts), buildESM(opts)];
}
