<template>
  <van-uploader
    v-model="fileList"
    multiple
    :max-count="5"
    accept="image/*"
    :disabled="isUploading"
    :after-read="afterRead"
    :before-delete="beforeDelete"
  >
    <template #preview-cover="{file}">
      <div class="preview-cover van-ellipsis">{{ file.name }}</div>
    </template>
  </van-uploader>
  <!-- <van-progress :percentage="50" /> -->
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import type {UploaderFileListItem} from "vant";
import {showDialog, showToast} from "vant";
import {compresseImage} from "@/utils/image-compressor";
import SparkMD5 from "spark-md5";
import {uploadChunk, mergeChunk} from "@/api/upload";

const worker = ref<any>(null);

const statusMap = {
  pending: "等待上传",
  uploading: "上传中",
  done: "上传成功",
  failed: "上传失败",
};
interface CustomUploaderFileListItem extends UploaderFileListItem {
  file: File; // 原始文件
  compressedFile?: File | null; // 压缩后的文件
  fileHash?: string; // 文件唯一 hash
  chunks?: {
    index: number;
    file: Blob;
    status?: "pending" | "uploading" | "done" | "failed" | string;
    message?: string;
    retries?: number;
  }[]; // 文件切片
  progress?: number; // 进度条
  chunkCount?: number; // 分片总数
}

interface Props {
  maxCount?: number;
  maxSize?: number;
  maxWidth?: number;
  quality?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 9,
  maxSize: 10 * 1024 * 1024, // 10MB
  maxWidth: 1920,
  quality: 0.8,
});

const emit = defineEmits<{
  (e: "update:modelValue", files: CustomUploaderFileListItem[]): void;
  (e: "success", files: CustomUploaderFileListItem[]): void;
  (e: "error", error: Error): void;
}>();

const isUploading = ref<boolean>(false);

const fileList = ref<CustomUploaderFileListItem[]>([]);
watch(
  () => fileList.value,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
);

// 文件读取完成后的回调函数，负责文件上传
const afterRead = async (
  file: UploaderFileListItem | UploaderFileListItem[],
) => {
  try {
    isUploading.value = true;
    const files = Array.isArray(file) ? file : [file];
    handleFileChange(files);
  } catch (e) {
    console.log("文件处理失败", e);
  } finally {
    isUploading.value = false;
  }
};

const baseURL = import.meta.env.VITE_API_BASE_URL;
const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB per chunk
const MAX_RETRIES = 3; // 最多重试次数

const handleFileChange = (files: any[]) => {
  files.forEach(async (item) => {
    item.status = "pending";
    item.message = statusMap.pending;
    item.progress = 0;
    // 图片压缩
    item.compressedFile = await compresseImage(item.file, {
      maxSize: props.maxSize,
    });
    // 计算文件 hash
    item.chunkCount = Math.ceil(item.compressedFile.size / CHUNK_SIZE);
    item.fileHash = await calculateHash(item.compressedFile);
    // console.log('-------------1----------------');
    // worker.value.postMessage({
    //   type: 'hash',
    //   file: item.compressedFile,
    // });
    // console.log('-------------2----------------');
    // 创建文件切片
    item.chunks = createFileChunks(item.compressedFile);

    item.status = "uploading";
    item.message = statusMap.uploading;
    await uploadChunks(item);
    console.log("item", item);
    const successNum = item.chunks.filter(
      (chunk: any) => chunk.status === "done",
    ).length;
    if (successNum === item.chunkCount) {
      const res = await mergeChunk({
        hash: item.fileHash,
        filename: item.file.name,
      });
      if (res.code === 200) {
        item.status = "done";
        item.message = statusMap.done;
      } else {
        item.status = "failed";
        item.message = statusMap.failed;
      }
    } else {
      item.status = "failed";
      item.message = statusMap.failed;
    }
  });
};

// 计算文件hash
const calculateHash = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(buffer);
      const hash = spark.end();
      resolve(hash);
    };
  });
};

// 创建文件切片
const createFileChunks = (file: File) => {
  const chunks = [];
  let cur = 0;
  while (cur < file.size) {
    chunks.push({
      index: chunks.length,
      file: file.slice(cur, cur + CHUNK_SIZE),
      status: "pending",
      message: statusMap.pending,
      retries: 0,
    });
    cur += CHUNK_SIZE;
  }
  return chunks;
};

// 🚀 上传切片（含并发控制 + 重试）maxConcurrency 最大并发数
async function uploadChunks(item: any, maxConcurrency = 3) {
  const pools = new Set();
  let uploadedChunkSize = 0; // 已上传成功 chunk 的 size

  async function taskFunc(chunk: any) {
    return new Promise(async (resolve, reject) => {
      try {
        chunk.status = "uploading";
        chunk.message = statusMap.uploading;
        await uploadChunkFile(chunk, item);
        uploadedChunkSize += chunk.file.size;
        item.progress = Math.round((uploadedChunkSize / item.file.size) * 100);
        chunk.status = "done";
        chunk.message = statusMap.done;
        resolve({chunk, item});
      } catch (err) {
        console.log("err", err);
        chunk.status = "failed";
        chunk.message = statusMap.failed;
        if (chunk.retries < MAX_RETRIES) {
          chunk.retries++;
          pools.add(taskFunc(chunk));
        } else {
          console.error(`切片 ${chunk.index} 上传失败`);
        }
        reject(err);
      }
    });
  }

  for (const chunk of item.chunks) {
    const task = taskFunc(chunk);

    // 任务完成后，从 Set 中删除
    task.then((res: any) => {
      console.log("========", res.item.fileHash, res.chunk.index, res.item.progress, '当前并发数：', pools.size);
      pools.delete(task);
    });

    // 将任务添加 Set 中
    pools.add(task);

    // 当达到最大并发数时，等待任意一个任务完成
    if (pools.size === maxConcurrency) {
      await Promise.race(pools);
    }
  }

  await Promise.all(pools);
}

// 上传切片
const uploadChunkFile = async (chunk: any, item: any) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("chunk", chunk.file);
    formData.append("hash", item?.fileHash || "");
    formData.append("filename", item.file.name);
    formData.append("index", chunk.index.toString());
    formData.append("total", item.chunkCount);
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${baseURL}/api/upload/chunk?hash=${item.fileHash}&index=${chunk.index}  `,
      true,
    );
    xhr.send(formData);
    xhr.onload = () =>
      xhr.status === 200 && JSON.parse(xhr.response).code === 200
        ? resolve("")
        : reject();
    xhr.onerror = reject;
  });
};

// 删除文件预览时触发
const beforeDelete = (file: CustomUploaderFileListItem) => {
  return new Promise<boolean>((resolve) => {
    showDialog({
      title: "提示",
      message: "确定要删除这张图片吗？",
      showCancelButton: true,
    })
      .then((action) => {
        if (action === "confirm") {
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

onMounted(() => {
  // 初始化 Worker
  worker.value = new Worker(
    new URL("@/workers/file.worker.js", import.meta.url),
    {type: "module"},
  );
  // 监听 Worker 消息
  worker.value.onmessage = (e: any) => {
    const {type, hash, chunks} = e.data;
    console.log("type", type);
    console.log("hash", hash);
    console.log("chunks", chunks);
    switch (type) {
      case "hash":
        break;
      case "chunks":
        break;
    }
  };
});

onUnmounted(() => {
  // 清理 Worker
  if (worker.value) {
    worker.value.terminate();
  }
});
</script>

<style scoped lang="less">
.img-uploader {
  width: 100%;
}

.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
</style>
