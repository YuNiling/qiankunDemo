import '@/public-path.js';
import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { directives } from '@/assets/utils/MicroApps.js';

Vue.config.productionTip = false

let instance = null;
function render(props = {}) {
  const { container } = props;

  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
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

if (directives) {
  console.log('directives', directives);
  directives.forEach((directive) => {
    Vue.directive(directive.name, directive.value);
  })
}