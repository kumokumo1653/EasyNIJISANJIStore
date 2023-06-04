const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    list: './src/contents/item/list/list.js',
    detail: './src/contents/item/detail/detail.js',
    common: './src/contents/common.js',
    popup: './src/popup/popup.js',
    scss: './src/common/bootstrap_custom.scss',
    background: './src/background/background.js',
    mylibrary: './src/mylibrary/mylibrary.js',
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
        { from: './src/lib/injectedScript.js' },
        { from: './src/contents/common.css' },
        { from: './src/contents/item/list/list.css' },
        { from: './src/popup/popup.html' },
        { from: './src/popup/popup.css' },
        { from: './src/options/options.html' },
        { from: './src/mylibrary/mylibrary.html' },
        { from: './src/mylibrary/mylibrary.css' },
        { from: './assets' },
      ],
    }),
  ],
};
