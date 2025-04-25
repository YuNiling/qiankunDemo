<template>
  <h1>Vant Uploader Demo</h1>
  <ImageUploader
    v-model="files"
    :max-count="9"
    :max-size="2 * 1024"
    @success="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import ImageUploader from '@/components/ImageUploader.vue';

const files = ref([]);

watch(
  () => files.value,
  (newVal) => {
    console.log('files.value', newVal);
  }
);

const handleSuccess = (files) => {
  console.log('上传成功', files);
};

const handleError = (error) => {
  console.error('上传失败', error);
};
</script>