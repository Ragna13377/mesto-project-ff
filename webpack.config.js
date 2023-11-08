const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: "development",
  context: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  entry: {
    main: './scripts/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDev ? 'scripts/[name].js' : 'scripts/[name].[contenthash].js',
    publicPath: '',
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
    compress: true,
    port: 8080,
    open: true,
    hot: true,
    watchFiles: ['src/**/*.html']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: isDev ? 'fonts/[name][ext][query]' : 'fonts/[name].[hash][ext][query]'
        }
      },
      {
        test: /\.(png|avif|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: isDev ? 'images/[name][ext][query]' : 'images/[name].[hash][ext][query]'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + "/";
              },
            },
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader",
          "sass-loader"
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: isDev? 'styles/[name].css' : 'styles/[name].[contenthash].css'
    }),
    new CleanWebpackPlugin(),
  ],
}