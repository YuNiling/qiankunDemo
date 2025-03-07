const vHighlight = {
  // vue2：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
  inserted: function (el) {
    el.classList.add('is-highlight');
  },
  // vue3：在绑定元素的父组件，及他自己的所有子节点都挂载完成后调用
  mounted: function (el) {
    el.classList.add('is-highlight');
  }
};

export default vHighlight;