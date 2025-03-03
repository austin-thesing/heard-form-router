import { watch } from "fs";
import { join } from "path";
import { build } from "bun";
import buildConfig, { dependencies } from "./build.js";

const srcDir = "./src";
const distDir = "./dist";

async function buildFile(entrypoint) {
  console.log(`Building ${entrypoint}...`);
  const result = await build({
    entrypoints: [entrypoint],
    outdir: buildConfig.outdir,
    minify: buildConfig.minify,
    target: buildConfig.target,
  });

  if (!result.success) {
    console.error(`Build failed for ${entrypoint}:`, result.logs);
    return false;
  }
  console.log(`Successfully built ${entrypoint}`);
  return true;
}

async function buildFiles(changedFile = null) {
  try {
    if (changedFile) {
      // If the changed file has dependencies, build those too
      const filesToBuild = new Set();
      const baseFileName = changedFile.split("/").pop();

      if (dependencies[baseFileName]) {
        // Add dependent files to build list
        dependencies[baseFileName].forEach((dep) => {
          filesToBuild.add(`./src/${dep}`);
        });
      } else {
        // Just build the changed file
        filesToBuild.add(`./src/${baseFileName}`);
      }

      for (const file of filesToBuild) {
        if (!(await buildFile(file))) return;
      }
    } else {
      // Initial build - build all entrypoints
      for (const entrypoint of buildConfig.entrypoints) {
        if (!(await buildFile(entrypoint))) return;
      }
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
      console.log(`File ${filename} changed. Rebuilding dependent files...`);
      await buildFiles(filename);
    }
  });
}
