import vColor from './vColor.js';
import vFocus from './vFocus.js';
import vDrag from './vDrag.js';
import vHighlight from './vHighlight.js';

const capitalize = function (value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
};
const currency = function (value) {
  return `$${Number(value).toFixed(2)}`;
};
const discount = function(value, rate) {
  return (Number(value) * rate).toFixed(2);
};

// 自定义指令
const directives = [
  { name: 'color', value: vColor },
  { name: 'focus', value: vFocus },
  { name: 'drag', value: vDrag },
  { name: 'highlight', value: vHighlight },
];

// 过滤器
const filters = [
  { name: 'capitalize', value: capitalize },
  { name: 'currency', value: currency },
  { name: 'discount', value: discount }
];

export {
  directives,
  filters
};