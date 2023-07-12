/**
 * MIT License
 *
 * Copyright (c) 2023 Byeongmin Jeon
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { ModuleFormat, OutputOptions, RollupOptions } from 'rollup';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';

type Options = {
  packageDir: string;
  entry: string | string[];
  external?: string[];
};

function generateBuilder(format: ModuleFormat): (options: Options) => RollupOptions {
  const extensions = ['.js', '.jsx', '.ts', '.tsx'];

  return (options: Options) => {
    const entries = Array.isArray(options.entry) ? options.entry : [options.entry];
    const input = entries.map(entry => path.resolve(options.packageDir, entry));

    const extension = format === 'esm' ? 'mjs' : 'js';
    const outputFile = `${options.packageDir}/build/lib/index.${extension}`;
    const output: OutputOptions = {
      format,
      file: outputFile,
      exports: 'named',
      sourcemap: true,
    };

    const external = options.external || [];

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

const buildCJS = generateBuilder('cjs');
const buildESM = generateBuilder('esm');

function buildConfigs(options: Options) {
  return [buildCJS(options), buildESM(options)];
}

const configs: RollupOptions[] = [
  ...buildConfigs({
    packageDir: 'packages/react',
    entry: 'src/index.ts',
    external: ['react', 'react-dom'],
  }),
];

export default configs;
