import { watch } from "node:fs";

const config = {
  entrypoints: ["./src/form-router.js", "./src/ms-form-builder.js", "./src/ms-form-router.js", "./src/schedule-guard.js", "./src/hubspot-scheduler.js"],
  outdir: "./dist",
  minify: true,
  target: "browser",
};

// Define dependencies for smarter rebuilds
const dependencies = {
  "form-config.js": ["./src/form-router.js", "./src/ms-form-router.js"],
};

async function buildFile(entrypoint) {
  console.log(`Building ${entrypoint}...`);
  const result = await Bun.build({
    entrypoints: [entrypoint],
    outdir: config.outdir,
    minify: config.minify,
    target: config.target,
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
      const filesToBuild = new Set();
      const baseFileName = changedFile.split("/").pop();

      // Check if the changed file is form-config.js
      if (baseFileName === "form-config.js") {
        // Build all dependent files
        dependencies["form-config.js"].forEach((dep) => filesToBuild.add(dep));
        console.log("Config file changed, rebuilding:", [...filesToBuild]);
      } else {
        // Just build the changed file if it's an entrypoint
        const fullPath = `./src/${baseFileName}`;
        if (config.entrypoints.includes(fullPath)) {
          filesToBuild.add(fullPath);
        }
      }

      for (const file of filesToBuild) {
        if (!(await buildFile(file))) return;
      }
    } else {
      // Initial build - build all entrypoints
      for (const entrypoint of config.entrypoints) {
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

// Handle watch flag
if (process.argv.includes("--watch")) {
  console.log("Watching for changes in src directory...");

  // Using node:fs watch instead of Bun.watch
  watch("./src", { recursive: true }, async (eventType, filename) => {
    if (filename) {
      console.log(`File ${filename} changed. Rebuilding dependent files...`);
      await buildFiles(filename);
    }
  });
}
