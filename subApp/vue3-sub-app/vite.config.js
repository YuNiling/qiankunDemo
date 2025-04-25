import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
const port = 8002;
// 如果是在主应用中加载子应用vite,必须打开这个,否则vite加载不成功, 单独运行没影响
// 因为开发环境作为子应用时与热更新插件有冲突（可能与其他修改html的差距也会存在冲突），所以需要额外的调试配置
const useDevMode = true;
export default defineConfig({
  plugins: [
    vue(),
    qiankun('vue3-sub-app', { // 微应用名字，与主应用注册的微应用名字保持一致
      useDevMode // true：不使用热更新插件，false：使用热更新，但无法作为子应用加载
    }),
    AutoImport({
      resolvers: [ElementPlusResolver(), VantResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver(), VantResolver()]
    }),
    viteCompression({
      verbose: true,  // 是否在控制台输出压缩日志
      disable: false, // 是否禁用
      threshold: 1024 * 1024 * 3, // 压缩大小限制 超过 3MB 才压缩
      algorithm: 'gzip', // 压缩算法
      ext: '.gz', // 压缩文件后缀
    })
  ],
  server: {
    cors: true,
    host: '0.0.0.0',
    port, // 子应用端口
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    middlewareMode: false,
  },
  base: process.env.NODE_ENV === 'production' ? '/subapp/vue3-sub-app/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
          @import "${path.resolve(__dirname, 'src/assets/variables.less')}";
          @import "${path.resolve(__dirname, 'src/assets/variables-mobile.less')}";
        `,
        javascriptEnabled: true
      },
      sass: {
        additionalData: `@use "${path.resolve(__dirname, 'src/assets/variables-pc.sass')}" as *;`,
      }
    }
  },
  build: {
    // minify: 'esbuild',
    // terserOptions: {
    //   compress: {
    //     drop_console: true, // 移除console
    //     pure_funcs: ['console.log'] // 移除指定函数
    //   }
    // },
    // target: 'esnext',
    assetsInlineLimit: 1024 * 1024 * 3, // 小于 3MB 的图片会被转为 base64
    // lib: {
    //   entry: './src/main.js',
    //   name: 'vue3-sub-app',
    //   formats: ['umd']
    // },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        manualChunks(src) {
          if (src.includes('node_modules')) {
            if (src.includes('element-plus')) {
              return 'element-plus';
            }
            if (src.includes('vant')) {
              return 'vant';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
