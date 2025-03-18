export default {
  namespaced: true,
  state: () => ({
    theme: "light",
  }),
  mutations: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
};
