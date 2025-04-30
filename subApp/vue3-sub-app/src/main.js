import { createApp, reactive } from 'vue';
import { createStore } from 'vuex';
import '@/public-path.js';
import App from '@/App.vue';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import router from '@/router/index.js';
import subStore from '@/store/index.js';
import { assignNestedProperties } from '@/utils/tools.js';
import 'vant/es/dialog/style';
import 'vant/es/toast/style';
import VConsole from 'vconsole';

let app = null;
const storeModuleName = 'vue3Module';
let store;

// let vconsole = new VConsole();
function render(props = {}) {
  const { container, directives, filters, prototypes, eventBus } = props;

  app = createApp(App);

  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    if (props.rootStore) {
      store = props.rootStore;
      if (!store.hasModule(storeModuleName)) {
        store.registerModule(storeModuleName, subStore);
      }
    }
  }

  if (!store) {
    store = createStore({
      modules: {
        [storeModuleName]: subStore
      }
    });
  } else {
    // 将store.state变成响应式代码
    const rootState = reactive({ ...JSON.parse(JSON.stringify(store.state)) });
    store.subscribe((mutation, state) => {
      assignNestedProperties(rootState, state);
    });
    app.provide('rootState', rootState);
  }

  app.use(store);
  app.use(router);
  // app.use(vconsole);
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