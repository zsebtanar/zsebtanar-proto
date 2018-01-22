const ENV_CONFIG = require('./config')

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

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

module.exports = {
  entry: {
    admin: './src/admin/admin.jsx',
    public: './src/public/public.jsx'
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: `${__dirname}/../bin/app`
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: !isProd && 'source-map',

  target: 'web',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.js', '.jsx', '.js', '.json'],
    modules: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../node_modules')]
  },

  devServer: {
    contentBase: path.resolve(__dirname, '../src/resources'),
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
  externals: 'firebase',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: isDev ? /(node_modules|bower_components)/ : undefined,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
            plugins: [
              require('babel-plugin-ramda').default,
              require('babel-plugin-transform-object-rest-spread'),
              require('babel-plugin-transform-class-properties')
            ],
            cacheDirectory: true
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

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },

  plugins: [
    sassExtract,
    // new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.ejs'),
      alwaysWriteToDisk: false,
      filename: 'admin.html',
      title: 'Zsebtanár - Tanár',
      isDev: !isProd,
      site: 'admin',
      chunks: ['vendor', 'admin'],
      hash: true,
      env: envConfig
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.ejs'),
      alwaysWriteToDisk: false,
      filename: 'index.html',
      isDev: !isProd,
      site: 'public',
      title: 'Zsebtanár',
      chunks: ['vendor', 'public'],
      hash: true,
      env: envConfig
    }),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.min.js'
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isProd),
      __PRODUCTION__: JSON.stringify(isProd),
      __FN_PATH__: JSON.stringify(envConfig.api)
    })
  ]
}
