import { createStore } from 'vuex';
import user from './modules/user';
import auth from './modules/auth';
import settings from './modules/settings';

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