import path from "path";
import url from 'url';

import NodeTargetPlugin from './node_modules/webpack/lib/node/NodeTargetPlugin.js';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __filename = path.format(url.pathToFileURL(import.meta.url));
const __dirname = path.dirname(__filename);

let modeApp;

if (process.argv[2] === '--mode=production') {
  console.log('Is production mode');
  modeApp = false;
} else {
  console.log('Is development mode');
  modeApp = true;
}

const config = {
  entry: "./index.ts",
  watchOptions: {
    aggregateTimeout: 500,
    ignored: /node_modules/
  },
  mode: modeApp,
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(ts|.js)?$/,
        exclude: [/node_modules/, /front/],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/typescript"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
    chunkFormat: 'module'
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new NodeTargetPlugin(),
    new CleanWebpackPlugin({
      dry: true,
      verbose: true
    }),
  ]
};
export default config;