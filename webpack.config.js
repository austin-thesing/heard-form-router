const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    "form-router": "./src/form-router.js",
    "ms-form-router": "./src/ms-form-router.js",
    "ms-form-builder": "./src/ms-form-build/ms-form-builder.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    library: {
      type: "window",
    },
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
