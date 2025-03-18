function handler(el) {
  el.style.position = 'absolute';
  el.style.cursor = 'move';
  const parentWidth = el.parentElement.clientWidth;
  const parentHeight = el.parentElement.clientHeight;

  el.onmousedown = function (event) {
    let offsetX = event.clientX - el.offsetLeft;
    let offsetY = event.clientY - el.offsetTop;
    document.onmousemove = function (event) {
      let disX = event.clientX - offsetX;
      let disY = event.clientY - offsetY;

      if (disX <= 0) {
        disX = 0;
      }
      if (disY <= 0) {
        disY = 0;
      }
      if (disX >= parentWidth - el.clientWidth) {
        disX = parentWidth - el.clientWidth;
      }
      if (disY >= parentHeight - el.clientHeight) {
        disY = parentHeight - el.clientHeight;
      }

      el.style.left = disX + 'px';
      el.style.top = disY + 'px';
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

const vDrag = {
  // vue2：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
  inserted: function (el) {
    handler(el);
  },
  // vue3：在绑定元素的父组件，及他自己的所有子节点都挂载完成后调用
  mounted: function (el) {
    handler(el);
  }
};

export default vDrag;