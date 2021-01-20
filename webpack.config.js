module.exports = {
  mode: "development",
  entry: {
    main: './src/main.js'
  },
  output: {
    path: __dirname  + '/dist',
    filename: '[name].js',
  },
  performance: {

    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};