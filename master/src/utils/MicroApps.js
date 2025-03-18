import vColor from './vColor.js';
import vFocus from './vFocus.js';
import vDrag from './vDrag.js';
import vHighlight from './vHighlight.js';
import dayjs from 'dayjs';
import * as tools from './tools.js';
import mitt from 'mitt';

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

// 全局属性/方法
const prototypes = [
  { name: '$dayjs', value: dayjs },
  { name: '$tools', value: tools },
];

// 事件总线（Event Bus）
const eventBus = new mitt();

export {
  directives,
  filters,
  prototypes,
  eventBus
};