const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizedCssAssetPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";

const filename = (name, ext) =>
  isDev ? `${name}.${ext}` : `${name}.[hash].${ext}`;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all"
    }
  };

  if (!isDev) {
    config.minimizer = [
      new OptimizedCssAssetPlugin(),
      new TerserWebpackPlugin()
    ];
  }

  return config;
};

const styleLoaders = addition => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    },
    "css-loader"
  ];

  if (addition) {
    loaders.push(addition);
  }

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: ["@babel/polyfill", "./scripts/index.js"],
  output: {
    filename: filename("bundle", "js"),
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    port: 4300
    // hot: isDev
  },
  optimization: optimization(),
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: !isDev
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename("style", "css")
    })
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "../src")
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: styleLoaders()
      },
      {
        test: /\.s[ac]ss$/,
        use: styleLoaders("sass-loader")
      },
      {
        test: /\.(ico|webp|png|jpg|jpeg|svg|gif|ttf|woff|woff2|eot)$/i,
        loader: "file-loader",
        options: {
          name: isDev ? "[path][name].[ext]" : "[path][hash].[ext]"
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
      }
    ]
  }
};
