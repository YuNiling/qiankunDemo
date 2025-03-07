const vColor = {
  bind: function(el, binding) {
    el.style.color = binding.value;
  }
};
const vFocus = {
  inserted: function(el) {
    el.focus(); // 当元素插入到 DOM 时自动聚焦
  }
};
const vDrag = {
  inserted: function(el) {
    el.style.position = 'absolute';
    el.style.cursor = 'move';
    const parentWidth = el.parentElement.clientWidth;
    const parentHeight = el.parentElement.clientHeight;
    
    el.onmousedown = function(event) {
      let offsetX = event.clientX - el.offsetLeft;
      let offsetY = event.clientY - el.offsetTop;
      document.onmousemove = function(event) {
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
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
};

// 自定义指令
const directives = [
  { name: 'color', value: vColor },
  { name: 'focus', value: vFocus },
  { name: 'drag', value: vDrag }
];

export {
  directives
};