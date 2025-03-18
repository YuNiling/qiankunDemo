import { ref, onMounted, onUnmounted } from 'vue';

// 按照惯例，组合式函数名以“use”开头
export function useEventListener(target, event, callback) {
  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => target.addEventListener(event, callback));
  onUnmounted(() => target.removeEventListener(event, callback));
}