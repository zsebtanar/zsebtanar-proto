const { injectJS, injectCSS } = require('./utils')
const { getConfig } = require('./config')

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const rhTransformer = require('react-hot-ts/lib/transformer')

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isProd = env === 'production'
const serverEnv = process.env.SERVER_ENV

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
const ADMIN_SRC_PATH = path.join(ROOT_PATH, 'src/client-admin')
const PUBLIC_SRC_PATH = path.join(ROOT_PATH, 'src/client-public')
const TARGET_PATH = path.join(ROOT_PATH, 'bin/app')
const RESOURCES_PATH = path.join(ROOT_PATH, 'resources')

const commonHtmlWebpackPluginOptions = {
  template: path.join(ROOT_PATH, 'src/client-common/index.ejs'),
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
  context: SRC_PATH,
  entry: {
    admin: [
      isDev && 'webpack-dev-server/client?http://localhost:8080',
      isDev && 'webpack/hot/only-dev-server',
      path.join(ADMIN_SRC_PATH, 'admin.tsx')
    ].filter(Boolean),
    public: [
      isDev && 'webpack-dev-server/client?http://localhost:8080',
      isDev && 'webpack/hot/only-dev-server',
      path.join(PUBLIC_SRC_PATH, 'public.tsx')
    ].filter(Boolean)
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
      shared: path.join(SRC_PATH, 'shared'),
      'client-common': path.join(SRC_PATH, 'client-common')
    },
    //    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.jsx', '.js', '.json']
  },

  devServer: {
    contentBase: [ADMIN_SRC_PATH, PUBLIC_SRC_PATH, SRC_PATH, RESOURCES_PATH],
    overlay: {
      warnings: true,
      errors: true
    },
    hot: true,
    inline: true,
    quiet: false,
    publicPath: '/',
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
        loader: 'ts-loader',
        options: {
          configFile: path.join(ROOT_PATH, 'build/ts/tsconfig.client.json'),
          compilerOptions: {
            noUnusedLocals: !isProd
          },
          transpileOnly: isDev,
          getCustomTransformers: {
            before: [rhTransformer({})]
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: cssExtract.extract(['css-loader'])
      },
      {
        test: /\.s?css$/,
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
              test: /[\\/]src[\\/]clint-admin[\\/]/,
              name: 'admin',
              chunks: 'initial',
              minSize: 1000,
              priority: 1
            },
            public: {
              test: /[\\/]src[\\/]clint-public[\\/]/,
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
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isProd),
      __PRODUCTION__: JSON.stringify(isProd),
      __CONFIG__: JSON.stringify(envConfig),
      __SERVER_ENV__: JSON.stringify(serverEnv)
    }),
    isDev && new webpack.HotModuleReplacementPlugin(),
    isDev && new webpack.NamedModulesPlugin()
    // isDev && new BundleAnalyzerPlugin({ analyzerMode: 'static', generateStatsFile: true })
  ].filter(Boolean)
}
