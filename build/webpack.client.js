const ENV_CONFIG = require('./config')

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const server = process.env.SERVER_ENV || 'development'
const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isProd = env === 'production'

const envConfig = ENV_CONFIG[server]

const sassExtract = new ExtractTextPlugin({
  filename: '[name].css',
  allChunks: true
})
const cssExtract = new ExtractTextPlugin({
  filename: '[name].css',
  allChunks: true
})

const ROOT_PATH = path.join(__dirname, '..')
const SRC_PATH = path.join(ROOT_PATH, 'src')
const TARGET_PATH = path.join(ROOT_PATH, 'bin/app')

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    admin: path.join(SRC_PATH, 'client-admin/admin.tsx'),
    public: path.join(SRC_PATH, 'client-public/public.tsx')
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: TARGET_PATH
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: !isProd && 'source-map',

  target: 'web',
  resolve: {
    alias: {
      shared: path.join(SRC_PATH, 'shared'),
      'client-common': path.join(SRC_PATH, 'client-common')
    },
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.jsx', '.js', '.json']
  },

  devServer: {
    contentBase: path.join(ROOT_PATH, 'resources'),
    overlay: {
      warnings: true,
      errors: true
    },
    inline: true,
    historyApiFallback: {
      verbose: true,
      rewrites: [
        { from: /^\/assets\/.*(.css|.png|.ico)$/, to: ctx => ctx.parsedUrl.pathname },
        { from: /^\/.*\.js$/, to: ctx => '/' + ctx.parsedUrl.pathname.split('/').pop() },
        { from: /^\/admin/, to: '/admin.html' },
        { from: /^\//, to: '/index.html' }
      ]
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: path.join(ROOT_PATH, 'build/ts/tsconfig.client.json'),
          compilerOptions: {
            noUnusedLocals: !isProd
          }
        }
      },
      {
        test: /\.css$/,
        use: cssExtract.extract(['css-loader'])
      },
      {
        test: /\.scss$/,
        use: sassExtract.extract(['css-loader', 'sass-loader'])
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },

  optimization: {
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    providedExports: true,
    namedModules: isDev,
    namedChunks: isDev,
    flagIncludedChunks: isProd,
    occurrenceOrder: isProd,
    usedExports: isProd,
    sideEffects: isProd,
    concatenateModules: isProd,
    minimize: isProd,
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },

  plugins: [
    sassExtract,
    new HtmlWebpackPlugin({
      template: path.join(ROOT_PATH, 'src/client-common/index.ejs'),
      alwaysWriteToDisk: false,
      filename: 'admin.html',
      title: 'Zsebtanár - Tanár',
      isDev: !isProd,
      site: 'admin',
      chunks: ['commons', 'admin'],
      hash: true,
      env: envConfig
    }),
    new HtmlWebpackPlugin({
      template: path.join(ROOT_PATH, 'src/client-common/index.ejs'),
      alwaysWriteToDisk: false,
      filename: 'index.html',
      isDev: !isProd,
      site: 'public',
      title: 'Zsebtanár',
      chunks: ['commons', 'public'],
      hash: true,
      env: envConfig
    }),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isProd),
      __PRODUCTION__: JSON.stringify(isProd),
      __CONFIG__: JSON.stringify(envConfig)
    })
  ].concat(
    isDev
      ? []
      : [
          new UglifyJsPlugin({})
          // new BundleAnalyzerPlugin({ analyzerMode: 'static', generateStatsFile: true })
        ]
  )
}
