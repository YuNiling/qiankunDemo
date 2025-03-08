import { createApp } from 'vue';
import '@/public-path.js';
import App from '@/App.vue';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import router from '@/router/index.js';

let app = null;

function render(props = {}) {
  const { container, directives, filters, prototypes, eventBus } = props;

  app = createApp(App);
  app.use(router);
  app.mount(container ? container.querySelector('#app') : '#app');

  if (directives) {
    directives.forEach((directive) => {
      app.directive(directive.name, directive.value);
    });
  }

  if (filters) {
    filters.forEach((filter) => {
      app.config.globalProperties[`$${filter.name}`] = filter.value;
    });
  }

  if (prototypes) {
    prototypes.forEach(((prototype) => {
      app.config.globalProperties[prototype.name] = prototype.value;
    }));
  }

  if (eventBus) {
    app.config.globalProperties.$bus = eventBus;
  }
}

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
} else {
  renderWithQiankun({
    bootstrap() {
      // console.log('Vue3 子应用 bootstraped');
    },
    mount(props) {
      // console.log('Vue3 子应用 mounted', props);
      render(props);
    },
    unmount() {
      // console.log('Vue3 子应用 unmounted');
      if (app) {
        app.unmount();
        app = null;
      }
    }
  });
}