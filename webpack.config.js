const path = require('path');
module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: './src/assets/ts/main.ts',
  //devtool: 'inline-source-map',
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@src': path.resolve(__dirname, 'src')
    }
  },
  output: {
    filename: 'main.js'
  }
};
