const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern-compiler'
            }
          }
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    proxy: [
        {
        context: ['/api'], 
        target: 'https://flyhigh.pro',
        changeOrigin: true,
        secure: true,
        pathRewrite: { '^/api': '/rekrutacja' } 
  }
    ]
  },
};