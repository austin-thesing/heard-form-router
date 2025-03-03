import { watch } from "fs";
import { join } from "path";
import { build } from "bun";

const srcDir = "./src";
const distDir = "./dist";

async function buildFiles() {
  try {
    const result = await build({
      entrypoints: ["./src/form-router.js"],
      outdir: "./dist",
      minify: true,
      target: "browser",
    });

    if (!result.success) {
      console.error("Build failed:", result.logs);
      return;
    }

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build error:", error);
  }
}

// Initial build
buildFiles();

// Watch for changes if --watch flag is present
if (process.argv.includes("--watch")) {
  console.log("Watching for changes in src directory...");

  watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename) {
      console.log(`File ${filename} changed. Rebuilding...`);
      await buildFiles();
    }
  });
}
