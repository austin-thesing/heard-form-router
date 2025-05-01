import { watch } from "node:fs";

const config = {
  entrypoints: ["./src/form-router.js", "./src/ms-form-builder.js", "./src/email-cap/ms-form-builder.js", "./src/ms-form-router.js", "./src/scheduler-bundle.js"],
  outdir: "./dist",
  minify: true,
  target: "browser",
};

// Define dependencies for smarter rebuilds
const dependencies = {
  "form-config.js": ["./src/form-router.js", "./src/ms-form-router.js", "./src/scheduler-bundle.js"],
  "ms-form-builder.js": ["./src/email-cap/form-builder.js"],
};

async function buildFile(entrypoint) {
  console.log(`Building ${entrypoint}...`);

  // Determine output directory based on file path
  let outdir = config.outdir;
  if (entrypoint.includes("/email-cap/")) {
    outdir = `${config.outdir}/email-cap`;
  }

  const result = await Bun.build({
    entrypoints: [entrypoint],
    outdir: outdir,
    minify: true,
    target: "browser",
    format: "esm", // Bun will handle the IIFE wrapping
  });

  if (!result.success) {
    console.error(`Build failed for ${entrypoint}:`, result.logs);
    return false;
  }

  // Add IIFE wrapper to the output
  for (const output of result.outputs) {
    const code = await output.text();
    const wrappedCode = `(function(){${code}})();`;
    await Bun.write(output.path, wrappedCode);
  }

  console.log(`Successfully built ${entrypoint}`);
  return true;
}

async function buildFiles(changedFile = null) {
  try {
    if (changedFile) {
      const filesToBuild = new Set();
      const baseFileName = changedFile.split("/").pop();

      if (baseFileName === "form-config.js") {
        dependencies["form-config.js"].forEach((dep) => filesToBuild.add(dep));
        console.log("Config file changed, rebuilding:", [...filesToBuild]);
      } else {
        const fullPath = `./src/${baseFileName}`;
        if (config.entrypoints.includes(fullPath)) {
          filesToBuild.add(fullPath);
        }
      }

      for (const file of filesToBuild) {
        if (!(await buildFile(file))) return;
      }
    } else {
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

  watch("./src", { recursive: true }, async (eventType, filename) => {
    if (filename) {
      console.log(`File ${filename} changed. Rebuilding dependent files...`);
      await buildFiles(filename);
    }
  });
}
