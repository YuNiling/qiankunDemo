const { name } = require('./package');
const { defineConfig } = require('@vue/cli-service')

const port = '8001'
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/subapp/vue2-sub-app/' : `//localhost:${port}/`,
  devServer: {
    port,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  // css: {
  //   modules: true
  // },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      // jsonpFunction: `webpackJsonp_${name}`  // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    }
  }
})
