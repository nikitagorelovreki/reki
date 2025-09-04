const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Принудительно используем одну версию React
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    fallback: {
      // Исключаем Node.js модули
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      util: false,
      url: false,
      http: false,
      https: false,
      os: false,
      assert: false,
      querystring: false,
      zlib: false,
      net: false,
      tty: false,
      timers: false,
      async_hooks: false,
      perf_hooks: false,
      repl: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify('http://localhost:3002/api'),
      'process.env.REACT_APP_AUTH_API_URL': JSON.stringify('http://localhost:3001/api'),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3004,
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    ],
  },
  devtool: 'source-map',
  // Исключаем только самые проблемные модули
  externals: {
    '@nestjs/common': 'commonjs @nestjs/common',
    '@nestjs/core': 'commonjs @nestjs/core',
    '@nestjs/platform-express': 'commonjs @nestjs/platform-express',
    'express': 'commonjs express',
    'passport': 'commonjs passport',
    'knex': 'commonjs knex',
    'pg': 'commonjs pg',
  },
};
