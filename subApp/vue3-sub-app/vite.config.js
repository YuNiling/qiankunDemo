import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';

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
    })
  ],
  server: {
    cors: true,
    port, // 子应用端口
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
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
        additionalData: `@import "${path.resolve(__dirname, 'src/assets/styles/variables.less')}";`,
        javascriptEnabled: true
      }
    }
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
    lib: {
      entry: './src/main.js',
      name: 'vue3-sub-app',
      formats: ['umd']
    }
  }
});
