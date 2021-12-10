const path = require('path');
Dotenv = require('dotenv-webpack');

module.exports = {
   entry: './client/main.js',
   output: {
      path: path.join(__dirname, '/bundle'),
      filename: 'index_bundle.js'
   },
   watch: true,
   module: {
      rules: [
         {
            test: /\.(js|jsx)?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
               presets: ["@babel/env", "@babel/react"]
            }
         }
      ]
   },
   plugins: [
      new Dotenv()
   ]
}