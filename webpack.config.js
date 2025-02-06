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
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 70000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                  targets: "> 0.25%, not dead",
                },
              ],
            ],
            cacheDirectory: false,
          },
        },
      },
    ],
  },
  cache: false,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: /node_modules/,
  },
};
