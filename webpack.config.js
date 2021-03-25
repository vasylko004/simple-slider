const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const miniCss = require('mini-css-extract-plugin');


module.exports = {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index.bundle.js"
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          },
          {
              test: /\.css$/,
              use: ["style-loader", "css-loader"]
          },
          {
            test: /\.(jpe?g|png|gif|svg|ico)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images',
                    publicPath: './images',
                    useRelativePath: true,
                    attrs: [
                      ':srcset',
                      ':data-srcset', 
                      'img:data-src', 
                      'img:src', 
                      'audio:src', 
                      'video:src', 
                      'track:src', 
                      'embed:src', 
                      'source:src', 
                      'input:src', 
                      'object:data', 
                      'script:src']
                }
            }]
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: "html-loader",
                
              }
            ]
          },
          {
            test: /\.scss$/i,
            use: [
              // Creates `style` nodes from JS strings
              miniCss.loader,
              // Translates CSS into CommonJS
              "css-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
          }
        ]
    },
    plugins: [
      new miniCss({
        filename: 'style.css',
      }),
      new HtmlWebPackPlugin({
          template: "./public/index.html",
          filename: "./index.html"
      })
    ]
}