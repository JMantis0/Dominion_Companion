const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const webpack = require("webpack");

module.exports = {
  entry: {
    popup: path.resolve("./src/popup/index.tsx"),
    options: path.resolve("./src/options/index.tsx"),
    dominion_companion: path.resolve("./src/content/contentScript.tsx"),
    background: path.resolve("./src/background/service-worker.tsx"),
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx?$/,
        exclude: [
          /node_modules/,
          path.resolve("./src/index.tsx"),
          path.resolve("./src/TestApp.tsx"),
          path.resolve("./src/TestObserver.tsx"),
          path.resolve("./src/TestDomRoot.tsx"),
          path.resolve("./src/testUtilFuncs.ts"),
        ],
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },

          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [tailwindcss, autoprefixer],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/static"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve(
            "node_modules/jqueryui/images/ui-icons_ffffff_256x240.png"
          ),
          to: path.resolve("dist"),
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENVIRONMENT": JSON.stringify(
        process.env.NODE_ENVIRONMENT
      ),
    }),
    ...getHtmlPlugins(["popup", "options"]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== "dominion_companion";
      },
    },
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: "Title",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
