
require('webpack-extract-css-hot-reload')
var ExactTextPlugin = require('extract-text-webpack-plugin');
var webPack = require('webpack')
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
var exactPlugin = new ExactTextPlugin({
  filename:'./public/dist/css/main.min.css'
});

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: './public/dist/js/bundle.min.js'
  },
  module: {
    rules: [
      //JS
      {
          test:/\.js$/,
          use:[
            {
              loader:'babel-loader',
              options:{
                presets:['es2015']
              }
            }
          ]
      },
      //SCSS
      {
        test:/\.scss$/,
        use:['webpack-extract-css-hot-reload'].concat(exactPlugin.extract({
          use:[{loader:'css-loader', options: { minimize: true }},{
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function () { // post css plugins, can be exported to postcss.config.js
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },{loader:'sass-loader'}]
        })),
      }
    ]
  },
  plugins: [
    new webPack.ProvidePlugin({
      $:'jquery'
    }),
    new webPack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new UnminifiedWebpackPlugin(),
    exactPlugin
  ]
};