export function fetch(url) {
  console.log('url', url);
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