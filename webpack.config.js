const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    content: './contents/content.js',
    popup: './popup/popup.js',
    scss: './common/bootstrap_custom.scss',
    background: './background/background.js',
    mylibrary: './mylibrary/mylibrary.js',
  },
  output: {
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './manifest.json' },
        { from: './contents/injectedScript.js' },
        { from: './contents/content.css' },
        { from: './popup/popup.html' },
        { from: './popup/popup.css' },
        { from: './options/options.html' },
        { from: './mylibrary/mylibrary.html' },
        { from: './mylibrary/mylibrary.css' },
        { from: './assets' },
      ],
    }),
  ],
};
