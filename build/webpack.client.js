const { injectJS, injectCSS } = require('./utils')
const { getConfig } = require('./config')

//const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin')

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isProd = env === 'production'

const envConfig = getConfig()

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

const commonHtmlWebpackPluginOptions = {
  template: path.join(SRC_PATH, 'client/generic/index.ejs'),
  alwaysWriteToDisk: false,
  isDev: !isProd,
  hash: true,
  env: envConfig,
  chunksSortMode: 'none',
  inject: false,
  inlineCSSRegex: isDev ? [] : ['.css$'],
  injectJS,
  injectCSS
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    admin: path.join(SRC_PATH, 'client/app-admin/admin.tsx'),
    public: path.join(SRC_PATH, 'client/app-public/public.tsx')
  },
  output: {
    path: TARGET_PATH,
    filename: `[name]-${isProd ? '[hash:8]' : ''}.js`,
    publicPath: '/',
    pathinfo: false
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: !isProd && 'source-map',
  cache: !isProd,
  bail: isProd,
  parallelism: Math.ceil(require('os').cpus().length / 2),
  target: 'web',
  resolve: {
    alias: {
      shared: path.join(SRC_PATH, 'shared')
    },
    //    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [
      'node_modules',
      SRC_PATH
    ]
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
    // headers: {
    //   'Content-Security-Policy': envConfig.csp.join('; ')
    // }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: SRC_PATH,
        loader: 'ts-loader',
        options: {
          configFile: path.join(ROOT_PATH, 'build/ts/tsconfig.client.json'),
          experimentalWatchApi: !isProd,
          compilerOptions: {
            noUnusedLocals: !isProd
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: cssExtract.extract(['css-loader'])
      },
      {
        test: /\.scss$/,
        use: sassExtract.extract(['css-loader', 'sass-loader'])
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules/ }
    ]
  },

  optimization: !isProd
    ? undefined
    : {
        minimizer: [
          new UglifyJsPlugin({
            parallel: 2,
            uglifyOptions: {
              compress: {
                warnings: false,
                drop_console: true
              },
              output: {
                comments: false
              }
            }
          })
        ],
        splitChunks: {
          minSize: 10000, // doesn't seem enforced...
          maxInitialRequests: 3, // only app and libs
          maxAsyncRequests: 2,
          cacheGroups: {
            default: false,
            vendors: false,
            firebase: {
              test: /[\\/]node_modules[\\/]@firebase[\\/]/,
              name: 'firebase',
              chunks: 'initial',
              minSize: 1,
              priority: 3
            },
            admin: {
              test: /[\\/]src[\\/]clint[\\/]app-admin[\\/]/,
              name: 'admin',
              chunks: 'initial',
              minSize: 1000,
              priority: 1
            },
            public: {
              test: /[\\/]src[\\/]clint[\\/]app-public[\\/]/,
              name: 'public',
              chunks: 'initial',
              minSize: 1000,
              priority: 1
            },
            common: {
              test: /[\\/]node_modules[\\/]/,
              name: 'common',
              chunks: 'initial',
              minSize: 10000,
              priority: -100
            }
          }
        },
        runtimeChunk: {
          name: 'manifest'
        }
      },
  plugins: [
    sassExtract,
    new HtmlWebpackPlugin({
      ...commonHtmlWebpackPluginOptions,
      filename: 'admin.html',
      title: 'Zsebtanár - Tanár',
      site: 'admin',
      excludeChunks: ['public', 'public-modal']
    }),
    new HtmlWebpackPlugin({
      ...commonHtmlWebpackPluginOptions,
      filename: 'index.html',
      site: 'public',
      title: 'Zsebtanár',
      excludeChunks: ['admin', 'admin-modal']
    }),
    // new InlineChunkManifestHtmlWebpackPlugin({
    //   dropAsset: true
    // }),
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
          // new BundleAnalyzerPlugin({ analyzerMode: 'static', generateStatsFile: true })
        ]
  )
}
