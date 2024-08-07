import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react-swc';
import svgzPlugin from './src/plugins/vite-plugin-svgz';

export default defineConfig({
  plugins: [react(), svgr(), svgzPlugin()],
});
