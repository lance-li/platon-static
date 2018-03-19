const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: process.env.VERSION ? `/script/rise_js/${process.env.VERSION}/` : `/rise_js/`
  },
  plugins: [
    new CleanWebpackPlugin(['__build__']),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        context: __dirname
      }
    })
  ]
})
