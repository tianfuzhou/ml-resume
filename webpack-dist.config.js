const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const findChrome = require('chrome-finder');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const EndWebpackPlugin = require('end-webpack-plugin');
const { WebPlugin } = require('web-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ghpages = require('gh-pages');

function publishGhPages() {
  return new Promise((resolve, reject) => {
    ghpages.publish(outputPath, { dotfiles: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
}

const outputPath = path.resolve(__dirname, '.public');
module.exports = {
  output: {
    path: outputPath,
    publicPath: '',
    filename: '[name]_[chunkhash:8].js',
  },
  resolve: {
    // 加快搜索速度
    modules: [path.resolve(__dirname, 'node_modules')],
    // es tree-shaking
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        // 提取出css
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // 压缩css
          use: ['css-loader?minimize', 'postcss-loader', 'sass-loader']
        }),
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.css$/,
        // 提取出css
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // 压缩css
          use: ['css-loader?minimize', 'postcss-loader'],
        }),
      },
      {
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
        loader: 'base64-inline-loader',
      },
    ]
  },
  entry: {
    main: './src/main.js',
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: `${outputPath}/assets` },
    ]),
    new WebPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new ExtractTextPlugin({
      filename: '[name]_[contenthash:8].css',
      allChunks: true,
    }),
    new EndWebpackPlugin(async () => {
      // 自定义域名
      fs.writeFileSync(path.resolve(outputPath, 'CNAME'), 'malin-life.com');

      await publishGhPages();

      // 调用 Chrome 渲染出 PDF 文件
      const chromePath = findChrome();
      spawnSync(chromePath, ['--headless', '--disable-gpu', `--print-to-pdf=${path.resolve(outputPath, 'resume.pdf')}`,
        'http://malin-life.com' // 这里注意改成你的在线简历的网站
      ]);

      // 重新发布到 ghpages
      await publishGhPages();
    }),
  ]
};
