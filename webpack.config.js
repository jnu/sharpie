const path = require("path");
const DEBUG = process.env.NODE_ENV !== "production";
const bundleExt = (DEBUG ? "" : ".min") + ".js";

module.exports = {
  entry: {
    "sharpie": "./src/index.ts",
  },
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
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]" + bundleExt,
    libraryTarget: "umd",
    library: "Sharpie",
  },
  resolve: {
    extensions: [".js", ".ts"],
    modules: [path.join(__dirname, "src"), "node_modules"],
  },
};
