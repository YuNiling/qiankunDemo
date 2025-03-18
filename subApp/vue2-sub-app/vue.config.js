const { name } = require('./package');
const { defineConfig } = require('@vue/cli-service');
const path = require('path');

const port = '8001'
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/subapp/vue2-sub-app/' : '/',
  devServer: {
    port,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  css: {
    // modules: true
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            hack: `true; @import "${path.resolve(__dirname, 'src/assets/variables.less')}";`
          },
          javascriptEnabled: true
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      // jsonpFunction: `webpackJsonp_${name}`  // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    }
  }
})
