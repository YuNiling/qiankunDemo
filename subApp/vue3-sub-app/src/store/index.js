import car from './modules/car.js';

export default {
  namespaced: true,
  modules: {
    car
  },
  state: () => ({
    title: 'vue3 模块'
  }),
  mutations: {
    changeTitle(state) {
      state.title = state.title === 'vue3 模块' ? 'vue3***新标题' : 'vue3 模块';
    }
  }
};