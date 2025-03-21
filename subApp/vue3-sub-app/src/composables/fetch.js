import { ref, toValue, watchEffect } from 'vue';
import { fetch } from '@/utils/tools.js';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);

  const fetchData = () => {
    data.value = null;
    error.value = null;

    fetch(toValue(url))
      .then((res) => (data.value = res))
      .catch((err) => (error.value = err));
  };

  watchEffect(() => {
    fetchData();
  });

  return { data, error };
}