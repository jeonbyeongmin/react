import type { ModuleFormat, OutputOptions, RollupOptions } from 'rollup';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';

/**
 * config
 */

const configs: RollupOptions[] = [
  ...generateRollupConfig({
    packageDir: 'packages/react',
    entry: ['src/hooks/index.ts'],
    external: ['react', 'react-dom'],
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

function generateBuilder(format: ModuleFormat): (opts: Options) => RollupOptions {
  const extensions = ['.js', '.jsx', '.ts', '.tsx'];

  return (opts: Options) => {
    // input
    const entries = Array.isArray(opts.entry) ? opts.entry : [opts.entry];
    const input = entries.map(entry => path.resolve(opts.packageDir, entry));

    // output
    const extension = format === 'esm' ? 'mjs' : 'js';
    const outputFile = `${opts.packageDir}/build/lib/index.${extension}`;
    const output: OutputOptions = {
      format,
      file: outputFile,
      exports: 'named',
      sourcemap: true,
    };

    // external
    const external = opts.external || [];

    return {
      input,
      output,
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
      external,
    };
  };
}

function generateRollupConfig(opts: Options) {
  const buildCJS = generateBuilder('cjs');
  const buildESM = generateBuilder('esm');

  return [buildCJS(opts), buildESM(opts)];
}
