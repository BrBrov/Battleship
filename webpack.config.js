import path from "path";
import url from 'url';

import NodeTargetPlugin from './node_modules/webpack/lib/node/NodeTargetPlugin.js';
// import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __filename = path.format(url.pathToFileURL(import.meta.url));
const __dirname = path.dirname(__filename);

// let modeApp;

// if (process.argv[2] === '--mode=production') {
//   console.log('Is production mode');
//   modeApp = false;
// } else {
//   console.log('Is development mode');
//   modeApp = true;
// }

const config = {
  entry: './index.ts',
  mode: "production",
  target: 'node18.16',
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
  plugins: [
    new NodeTargetPlugin()
  ]
};

export default config;