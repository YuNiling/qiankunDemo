const vFocus = {
  // vue2：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
  inserted: function(el) {
    el.focus(); // 当元素插入到 DOM 时自动聚焦
  },
  // vue3：在绑定元素的父组件，及他自己的所有子节点都挂载完成后调用
  mounted: function(el) {
    el.focus();
  },
};

export default vFocus;