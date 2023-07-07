import path from "path";
import url from 'url';

import NodeTargetPlugin from './node_modules/webpack/lib/node/NodeTargetPlugin.js';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';

const __filename = path.format(url.pathToFileURL(import.meta.url));
const __dirname = path.dirname(__filename);

let usePlugins;

if (process.argv[2] === '--mode=production') {
  console.log('Building app...');
  usePlugins = [new NodeTargetPlugin()];
} else {
  console.log('App is openning for development...');
  usePlugins = [
    new NodeTargetPlugin(),
    new CleanWebpackPlugin(),
    new NodemonPlugin()
  ];
}

const config = {
  entry: './index.ts',
  target: 'node18.06',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
    experiments: {
    outputModule: true
  },
  plugins: usePlugins
};

export default config;