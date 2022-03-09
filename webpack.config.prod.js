const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/i,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        // test: /\.svg(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', {
            loader: 'css-loader', options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.json']
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
}