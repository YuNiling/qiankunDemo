import '@/public-path.js';
import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';

Vue.config.productionTip = false

let instance = null;
function render(props = {}) {
  const { container, directives, filters, prototypes, eventBus } = props;

  instance = new Vue({
    router,
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