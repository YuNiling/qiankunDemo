// 处理静态资源路径
if (window.__POWERED_BY_QIANKUN__) {
  // 作为微应用被加载时，调整静态资源路径，以确保静态资源能正确加载
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}