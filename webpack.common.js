const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/index.tsx']
  },
  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk_[chunkhash].js',
    publicPath: '/'
  },
  plugins: [],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'utils': path.resolve(__dirname, 'src/utils'),
      'reduxutil': path.resolve(__dirname, 'src/redux')
    }
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader?transpileOnly=true']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        use: ['url-loader?limit=10000']
      }
    ]
  }
}
