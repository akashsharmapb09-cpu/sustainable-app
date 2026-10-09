import { readFileSync } from 'node:fs';
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config.ts';

export default mergeConfig(baseConfig, defineConfig({
  server: {
    host: 'localhost',
    port: 5175,
    strictPort: true,
    https: {
      pfx: readFileSync(new URL('./.cert/localhost.pfx', import.meta.url)),
    },
  },
}));
