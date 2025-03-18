export default {
  namespaced: true,
  state: () => ({
    name: 'Alice',
    age: 25
  }),
  mutations: {
    updateName(state) {
      state.name = state.name === 'Alice' ? 'Bob' : 'Alice';
    },
    updateAge(state) {
      state.age = state.age === 25 ? 30 : 25;
    }
  }
};