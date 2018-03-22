const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')

var HtmlWebpackPlugin = require('html-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    historyApiFallback: true,
    disableHostCheck: true,
    bonjour: false,
    lazy: true,
    host: '0.0.0.0',
    port: 4000,
    openPage: 'rise/static/rise',
    proxy: {
      '/rise/*': {
        target: 'http://0.0.0.0:8080',
        secure: false,
        bypass: function(req) {
          if(req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return 'index.html'
          }
        }
      },
      '/': {
        target: 'http://0.0.0.0:8080',
        secure: false,
        bypass: function(req) {
          if(req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return 'index.html'
          }
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new BundleAnalyzerPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})
