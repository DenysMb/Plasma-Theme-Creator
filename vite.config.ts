import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    {
      name: "load-svgz",
      async load(id) {
        if (id.endsWith(".svgz")) {
          const filePath = path.resolve(__dirname, id);
          const data = await fs.promises.readFile(filePath);
          return `export default ${JSON.stringify(data.toString("binary"))}`;
        }
        return null;
      },
    },
  ],
});
