import type { ModuleFormat, RollupOptions } from 'rollup';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

/**
 * config
 */

const configs: RollupOptions[] = [
  ...generateRollupConfig({
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
  external?: string[];
};

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function generateBuilder(format: ModuleFormat): (opts: Options) => RollupOptions {
  return (opts: Options) => {
    const entries = Array.isArray(opts.entry) ? opts.entry : [opts.entry];
    const input = entries.map(entry => `${opts.packageDir}/${entry}`);
    const outputFile = `${opts.packageDir}/build/${format}/index.${format}.js}}`;

    return {
      input,
      output: {
        format,
        file: `${opts.packageDir}/build/${format}/index.js`,
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
      external: opts.external,
    };
  };
}

const buildCJS = generateBuilder('cjs');
const buildESM = generateBuilder('esm');

function generateRollupConfig(opts: Options) {
  return [buildCJS(opts), buildESM(opts)];
}
