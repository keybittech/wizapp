import type { Options } from 'tsup';

const config: Options = {
  splitting: true,
  entry: {
    'lib/index': 'src/lib/index.ts',
    'server/cli': 'src/server/cli.ts',
    'server/index': 'src/server/index.ts'
  },
  
  format: ['cjs', 'esm'],
  outDir: 'dist',
  clean: true,
}

export default config;