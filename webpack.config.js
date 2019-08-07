const path = require("path");
const DEBUG = process.env.NODE_ENV !== "production";
const bundleExt = (DEBUG ? "" : ".min") + ".js";

const baseConfig = {
  mode: DEBUG ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: "babel-loader",
          options: {cacheDirectory: true},
        }]
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [{
          loader: "babel-loader",
          options: {cacheDirectory: true},
        }, {
          loader: "ts-loader",
        }],
      },
    ],
  },
  devtool: DEBUG ? "source-map" : false,
  resolve: {
    extensions: [".js", ".ts"],
    modules: [path.join(__dirname, "src"), "node_modules"],
  },
};

/**
 * Configuration for the web library.
 */
const libConfig = {...baseConfig,
  entry: {
    "sharpie": "./src/index.ts",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]" + bundleExt,
    libraryTarget: "umd",
    library: "Sharpie",
  },
};

/**
 * Configuration for the CLI tool.
 */
const cliConfig = {...baseConfig,
  entry: {
    "cli": "./src/cli.ts",
  },
  target: "node",
  output: {
    path: path.join(__dirname, "bin"),
    filename: "cli.js",
  },
};

module.exports = [libConfig, cliConfig];
