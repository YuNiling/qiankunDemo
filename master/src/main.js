import { createApp } from 'vue';
import '@/public-path.js';
import '@/assets/styles/global.less';
import App from '@/App.vue';
import router from '@/router/index.js';
import { directives, eventBus } from '@/assets/utils/MicroApps.js';
import store from '@/store/index';

const app = createApp(App);

if (directives) {
  directives.forEach((directive) => {
    app.directive(directive.name, directive.value);
  });
}

if (eventBus) {
  app.config.globalProperties.$bus = eventBus;
}

app.use(router);
app.use(store);
app.mount('#app');