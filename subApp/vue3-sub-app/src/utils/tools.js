// 递归函数用于赋值属性
export function assignNestedProperties(target, source) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === 'object' && source[key]!== null) {
        if (!target[key]) {
          target[key] = reactive({});
        }
        assignNestedProperties(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}

export function fetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.floor(Math.random() * 10) + 1;
      if (num % 2 === 0) {
        resolve('加载成功');
      } else {
        reject('typeof error');
      }
    }, 2000);
  });
}