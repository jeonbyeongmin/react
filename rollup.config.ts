import type { RollupOptions } from 'rollup';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const configs: RollupOptions[] = [
  ...generateConfig({
    packageDir: '.',
  }),
];

type GenerateConfigOptions = {
  packageDir: string;
};

function generateConfig(opts: GenerateConfigOptions) {
  return [
    {
      input: `${opts.packageDir}/src/index.ts`,
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
    },
  ];
}

export default configs;
