export default {
  entrypoints: ["./src/form-router.js", "./src/ms-form-builder.js", "./src/ms-form-router.js", "./src/schedule-guard.js"],
  outdir: "./dist",
  minify: true,
  target: "browser",
};

// Define dependencies for smarter rebuilds
export const dependencies = {
  "form-config.js": ["form-router.js", "ms-form-router.js"],
};
