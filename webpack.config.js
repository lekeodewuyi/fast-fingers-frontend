const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/scripts/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'script.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    // MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                    },
                ]
            },
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                'file-loader',
              ],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('./index.html'),
          }),
      ],
    optimization: {
        minimize: true,
        minimizer: [
          new UglifyJSPlugin({
            uglifyOptions: {
              compress: {
                // Drop only console.logs but leave others
                pure_funcs: ['console.log'],
              },
              mangle: {
                // Note: I'm not certain this is needed.
                reserved: ['console.log']
              }
            }
          }),
          new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})
        ],
      },
    

}