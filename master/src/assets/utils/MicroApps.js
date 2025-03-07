import vColor from './vColor.js';
import vFocus from './vFocus.js';
import vDrag from './vDrag.js';
import vHighlight from './vHighlight.js';

// 自定义指令
const directives = [
  { name: 'color', value: vColor },
  { name: 'focus', value: vFocus },
  { name: 'drag', value: vDrag },
  { name: 'highlight', value: vHighlight },
];

export {
  directives
};