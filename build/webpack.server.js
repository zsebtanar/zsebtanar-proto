const webpack = require('webpack')

const path = require('path')
const fs = require('fs')

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isProd = env === 'production'
const serverEnv = process.env.SERVER_ENV

const ROOT_PATH = path.join(__dirname, '..')
const SRC_PATH = path.join(ROOT_PATH, 'src')
const TARGET_PATH = path.join(ROOT_PATH, 'bin/functions')

const nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = {
  mode: isDev ? 'development' : 'production',
  context: path.join(SRC_PATH, 'server'),
  entry: {
    index: path.join(SRC_PATH, 'server/index.ts')
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'this',
    publicPath: '/',
    path: TARGET_PATH
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  target: 'node',
  externals: nodeModules,
  resolve: {
    alias: {
      shared: path.join(SRC_PATH, 'shared')
    },
    modules: ['node_modules'],
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    noParse: [/webpack\.client/],
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: isProd,
          configFile: path.join(ROOT_PATH, 'build/ts/tsconfig.server.json'),
          compilerOptions: {
            noUnusedLocals: !isProd
          }
        }
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },

  optimization: { minimize: false },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(isDev),
      __SERVER_ENV__: JSON.stringify(serverEnv)
    })
  ]
}
