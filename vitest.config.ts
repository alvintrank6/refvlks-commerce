import { defineConfig } from "vitest/config";

// Keep unit tests independent from the Cloudflare Worker build plugin.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
