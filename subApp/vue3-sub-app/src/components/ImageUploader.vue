<template>
  <van-uploader 
    v-model="fileList" 
    multiple 
    :max-count="5"
    accept="image/*" 
    :disabled	="isUploading"
    :after-read="afterRead"
    :before-delete="beforeDelete"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { UploaderFileListItem } from 'vant';
import { showDialog, showToast } from 'vant';
import { compresseImage } from '@/utils/image-compressor';

interface CustomUploaderFileListItem extends UploaderFileListItem {
  file: File; // 原始文件
  compressedFile?: File | null; // 压缩后的文件
}

interface Props {
  maxCount?: number;
  maxSize?: number;
  maxWidth?: number;
  quality?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 9,
  maxSize: 5 * 1024 * 1024, // 5MB
  maxWidth: 1920,
  quality: 0.8,
});

const emit = defineEmits<{
  (e: 'update:modelValue', files: CustomUploaderFileListItem[]): void;
  (e: 'success', files: CustomUploaderFileListItem[]): void;
  (e: 'error', error: Error): void;
}>();

const isUploading = ref<boolean>(false);

const fileList = ref<CustomUploaderFileListItem[]>([]);
watch(() => fileList.value, (newVal) => {
  emit('update:modelValue', newVal);
});

// 文件读取完成后的回调函数，负责文件上传
const afterRead= async (file: UploaderFileListItem | UploaderFileListItem[]) => {
  try {
    isUploading.value = true;
    const files = Array.isArray(file) ? file : [file];
    await Promise.all(
      files.map(async (item) => {
        await uploadImage(item as CustomUploaderFileListItem);
        return item;
      })
    );
  } catch (e) {
    console.log('文件处理失败', e);
    showToast('文件处理失败');
  } finally {
    isUploading.value = false;
  }
};

const baseURL = import.meta.env.VITE_API_BASE_URL;

// 上传图片
const uploadImage = async (item: CustomUploaderFileListItem) => {
  let interval: number | undefined;
  try {
    const file = item.file;
    item.status = 'uploading';
    item.message = '上传0%';

    item.compressedFile = await compresseImage(file, {
      maxSize: props.maxSize
    });

    // 模拟上传进度
    const formData = new FormData();
    formData.append('file', item.compressedFile);

    // 模拟进度条：从0%缓慢增加到90%，剩下10%等待上传完成后补足
    let fakeProgress = 0;
    interval = setInterval(() => {
      if (fakeProgress < 90) {
        fakeProgress += parseInt((Math.random() * 5).toFixed(0)); // 每次增加 0~5%
        if (fakeProgress > 90) fakeProgress = 90;
        item.message = `上传${fakeProgress}%`;
      } 
    }, 200);

    // 这里替换为实际上传接口
    await new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${baseURL}/api/upload/singleFile`, true);
      xhr.onload = () => {
        item.message = '上传100%';
        clearInterval(interval);
        if (xhr.status === 200) {
          setTimeout(() => {
            item.status = 'done';
            item.message = '上传成功';
            resolve(xhr.response);
          }, 200);
        } else {
          item.status = 'failed';
          item.message = '上传失败';
        }
        isUploading.value = false;
      };
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          // item.percentage = Math.round((event.loaded / event.total) * 100);
        }
      };
      xhr.onerror = () => {
        item.status = 'failed';
        item.message = '上传失败';
        clearInterval(interval);
        isUploading.value = false;
      };
      xhr.send(formData);
    });

    emit('success', fileList.value);
  } catch (error) {
    item.status = 'failed';
    item.message = '上传失败';
    interval && clearInterval(interval);
    isUploading.value = false;

    emit('error', error as Error);
  }
};

// 删除文件预览时触发
const beforeDelete = (file: CustomUploaderFileListItem) => {
  return new Promise<boolean>((resolve) => {
    showDialog({
      title: '提示',
      message: '确定要删除这张图片吗？',
      showCancelButton: true
    })
      .then((action) => {
        if (action === 'confirm') {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => {
        resolve(false);
      });
  });
};
</script>

<style scoped lang="less">
.img-uploader {
  width: 100%;
}
</style>
