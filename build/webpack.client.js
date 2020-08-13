const { getConfig } = require('./config')

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const rhTransformer = require('react-hot-ts/lib/transformer')

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isProd = env === 'production'
const serverEnv = process.env.SERVER_ENV

const envConfig = getConfig()

const ROOT_PATH = path.join(__dirname, '..')
const TARGET_PATH = path.join(ROOT_PATH, 'bin/app')
const RESOURCES_PATH = path.join(ROOT_PATH, 'resources')
const SRC_PATH = path.join(ROOT_PATH, 'src')
const ADMIN_SRC_PATH = path.join(SRC_PATH, 'client/app-admin/')
const PUBLIC_SRC_PATH = path.join(SRC_PATH, 'client/app-public')

const commonHtmlWebpackPluginOptions = {
  template: path.join(SRC_PATH, 'client/generic/index.ejs'),
  alwaysWriteToDisk: false,
  isDev: !isProd,
  hash: true,
  env: envConfig,
  chunksSortMode: 'none',
  inject: false,
  inlineCSSRegex: isDev ? [] : ['.css$'],
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  context: SRC_PATH,
  entry: {
    admin: [
      isDev && 'webpack-dev-server/client?http://localhost:8080',
      isDev && 'webpack/hot/only-dev-server',
      path.join(ADMIN_SRC_PATH, 'admin.tsx'),
    ].filter(Boolean),
    public: [
      isDev && 'webpack-dev-server/client?http://localhost:8080',
      isDev && 'webpack/hot/only-dev-server',
      path.join(PUBLIC_SRC_PATH, 'public.tsx'),
    ].filter(Boolean),
  },
  output: {
    path: TARGET_PATH,
    filename: `[name]-${isProd ? '[hash:8]' : ''}.js`,
    publicPath: '/',
    pathinfo: false,
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
    },
    //    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: ['node_modules', SRC_PATH],
  },

  devServer: {
    contentBase: [ADMIN_SRC_PATH, PUBLIC_SRC_PATH, SRC_PATH, RESOURCES_PATH],
    overlay: {
      warnings: true,
      errors: true,
    },
    hot: true,
    inline: true,
    quiet: false,
    publicPath: '/',
    historyApiFallback: {
      verbose: true,
      rewrites: [
        { from: /^\/assets\/.*(.css|.png|.ico)$/, to: (ctx) => ctx.parsedUrl.pathname },
        { from: /^\/.*\.js$/, to: (ctx) => '/' + ctx.parsedUrl.pathname.split('/').pop() },
        { from: /^\/admin/, to: '/admin.html' },
        { from: /^\//, to: '/index.html' },
      ],
    },
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
            noUnusedLocals: !isProd,
          },
          transpileOnly: isDev,
          getCustomTransformers: {
            before: [rhTransformer({})],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: isDev },
          },
          'css-loader?url=false',
          'sass-loader',
        ],
        sideEffects: true,
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules/ },
    ],
  },

  optimization: isProd
    ? {
        minimize: true,
        minimizer: [new TerserPlugin({ parallel: true, extractComments: true })],
        runtimeChunk: {
          name: 'manifest',
        },
      }
    : undefined,
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      ...commonHtmlWebpackPluginOptions,
      filename: 'admin.html',
      title: 'Zsebtanár - Admin',
      site: 'admin',
      excludeChunks: ['public'],
    }),
    new HtmlWebpackPlugin({
      ...commonHtmlWebpackPluginOptions,
      filename: 'index.html',
      site: 'public',
      title: 'Zsebtanár',
      excludeChunks: ['admin'],
    }),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isProd),
      __PRODUCTION__: JSON.stringify(isProd),
      __CONFIG__: JSON.stringify(envConfig),
      __SERVER_ENV__: JSON.stringify(serverEnv),
    }),
    isDev && new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    !isDev && new BundleAnalyzerPlugin({ analyzerMode: 'static', generateStatsFile: true }),
  ].filter(Boolean),
}
