import car from './car.js';

export default {
  namespaced: true,
  modules: {
    car
  },
  state: () => ({
    title: 'vue2 模块'
  }),
  mutations: {
    changeTitle(state) {
      state.title = state.title === 'vue2 模块' ? 'vue2***新标题' : 'vue2 模块';
    }
  }
};