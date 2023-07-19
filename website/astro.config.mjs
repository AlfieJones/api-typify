import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import markdoc from "@astrojs/markdoc";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), markdoc(), preact()],
});
