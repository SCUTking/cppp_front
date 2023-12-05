/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-07-31 09:42:42
 */
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // webpack plugins
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
        threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
        deleteOriginalAssets: false, // 是否删除原文件
      }),
      new NodePolyfillPlugin(),
    ],
    module: {},
  },
  chainWebpack: (config) => {
    // 将 src 设置别名为 @ ，引用地址变为 @/
    config.resolve.alias.set('@$', resolve('src'));
  },
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        ws: true,
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
});
