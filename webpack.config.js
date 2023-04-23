import url from "url";
import path from "path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: [
    "./src/index.ts",
    "./src/cli.ts"
  ],
  output: {
    filename: "index.js",
    path: __dirname + "/build",
    libraryTarget: 'module',
    chunkFormat: 'module',
    environment: {
      module: true
    }
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ],
  },
  target: "node",
  mode: "production",
  experiments: {
    topLevelAwait: true, // Optional: if you want to use top-level await in your code
    outputModule: true,
  },
};
