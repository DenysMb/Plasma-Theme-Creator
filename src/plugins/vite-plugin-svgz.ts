import { Plugin } from 'vite';
import { createFilter } from '@rollup/pluginutils';
import fs from 'fs';
import path from 'path';

export default function svgzPlugin(): Plugin {
  const filter = createFilter(/\.svgz$/);

  return {
    name: 'vite-plugin-svgz',
    enforce: 'pre',
    async load(id) {
      if (!filter(id)) return null;

      const filePath = path.resolve(id);
      const content = fs.readFileSync(filePath, 'base64');
      const encodedContent = `data:image/svg+xml;base64,${content}`;

      return `export default "${encodedContent}"`;
    }
  };
}
