export default {
  namespaced: true,
  state: () => ({
    hphm: '粤A12345',
    color: '蓝色'
  }),
  mutations: {
    changeHphm(state) {
      state.hphm = state.hphm === '粤B22222' ? '粤A12345' : '粤B22222';
    },
    changeColor(state) {
      state.color = state.color === '蓝色' ? '绿色' : '蓝色';
    }
  }
};