import '@/public-path.js';
import Vue from 'vue';
import Vuex from 'vuex';
import App from '@/App.vue';
import router from '@/router';
import subStore from './store';

Vue.config.productionTip = false
Vue.use(Vuex);

let instance = null;
const storeModuleName = 'vue2Module';
let store;
function render(props = {}) {
  const { container, directives, filters, prototypes, eventBus } = props;

  if (window.__POWERED_BY_QIANKUN__) {
    if (props.rootStore) {
      store = props.rootStore;
      if (!store.hasModule(storeModuleName)) {
        store.registerModule(storeModuleName, subStore);
      }
    }
  }

  if (!store) {
    store = new Vuex.Store({
      modules: {
        [storeModuleName]: subStore
      }
    });
  }

  Vue.observable(store); // 将共享store设置为响应式，否则子应用的store中的值不会改变
  
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');

  if (directives) {
    directives.forEach((directive) => {
      Vue.directive(directive.name, directive.value);
    })
  }

  if (filters) {
    filters.forEach((filter) => {
      Vue.filter(filter.name, filter.value);
    });
  }

  if (prototypes) {
    prototypes.forEach(((prototype) => {
      Vue.prototype[prototype.name] = prototype.value;
    }));
  }

  if (eventBus) {
    Vue.prototype.$bus = eventBus;
  }
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  // console.log('Vue2 子应用 bootstraped');
}
export async function mount(props) {
  // console.log('Vue2 子应用 mount', props);
  render(props);
}
export async function unmount() {
  // console.log('Vue2 子应用 unmount');
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}