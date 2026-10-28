import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// GitHub Pages: https://the-tito.github.io/5-things/
// Cada página se genera como carpeta/index.html para conservar las URLs ya compartidas.
export default defineConfig({
  site: "https://the-tito.github.io",
  base: "/5-things/",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [mdx()],
});
