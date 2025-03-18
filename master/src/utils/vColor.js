const vColor = {
  // vue2：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
  bind: function(el, binding, vnode, oldVnode) {
    el.style.color = binding.value;
  },
  // vue3：在元素被插入到 DOM 前调用
  beforeMount: function(el, binding, vnode) {
    el.style.color = binding.value;
  }
};

export default vColor;