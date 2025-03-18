import { createStore } from 'vuex';
import user from './user';
import auth from './auth';
import settings from './settings';

export default createStore({
  namespaced: true,
  modules: {
    user,
    auth,
    settings
  },
  state: () => ({
    role: 'admin'
  }),
  mutations: {
    setRole(state) {
      state.role = state.role === 'admin' ? '游客' : 'admin';
    }
  }
});