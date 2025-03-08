import { createApp } from 'vue';
import '@/public-path.js';
import '@/assets/styles/global.less';
import App from '@/App.vue';
import router from '@/router/index.js';
import store from '@/store/index.js';
import { directives, eventBus } from '@/assets/utils/MicroApps.js';

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');

if (directives) {
  directives.forEach((directive) => {
    app.directive(directive.name, directive.value);
  });
}

if (eventBus) {
  app.config.globalProperties.$bus = eventBus;
}