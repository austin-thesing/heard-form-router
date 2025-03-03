import { watch } from "fs";
import { join } from "path";
import { build } from "bun";
import buildConfig from "./build.js";

const srcDir = "./src";
const distDir = "./dist";

async function buildFiles() {
  try {
    for (const entrypoint of buildConfig.entrypoints) {
      console.log(`Building ${entrypoint}...`);
      const result = await build({
        entrypoints: [entrypoint],
        outdir: buildConfig.outdir,
        minify: buildConfig.minify,
        target: buildConfig.target,
      });

      if (!result.success) {
        console.error(`Build failed for ${entrypoint}:`, result.logs);
        return;
      }
      console.log(`Successfully built ${entrypoint}`);
    }

    console.log("All builds completed successfully!");
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
      console.log(`File ${filename} changed. Rebuilding all files...`);
      await buildFiles();
    }
  });
}
