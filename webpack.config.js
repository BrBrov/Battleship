import path from "path";
import url from 'url';

import NodeTargetPlugin from './node_modules/webpack/lib/node/NodeTargetPlugin.js';
import WebpackShellPlugin from "webpack-shell-plugin-next";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const __filename = path.format(url.pathToFileURL(import.meta.url));
const __dirname = path.dirname(__filename);

let scriptExec;
let modeApp;

if (process.argv[2] === '--mode=production') {
  modeApp = 'production';
  scriptExec = 'node dist/server.js';
} else {
  modeApp = 'development';
  scriptExec = 'nodemon dist/server.js';
}

const config = {
  entry: "./index.js",
  watch: true,
  mode: modeApp,
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
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
    new WebpackShellPlugin({
      // onBuildStart: {
      //   scripts:['npm run clean'
      // ],
      //   blocking: false,
      //   parallel: false,
      // },
      onBuildEnd: {
        scripts:[scriptExec],
        blocking: false,
        parallel: false,
      }
    }),
    new CleanWebpackPlugin({
      dry: true,
      verbose: true
    })
  ]
};
export default config;