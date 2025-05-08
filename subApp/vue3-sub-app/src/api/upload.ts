import { request } from './axios';

// 上传文件切片
export const uploadChunk = (data: any, formData: FormData) => {
  return request({
    url: '/api/upload/chunk',
    method: 'POST',
    data: formData,
    params: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    cache: false,
    debounce: false,
  });
};

// 合并文件切片
export const mergeChunk = (data: any) => {
  return request({
    url: '/api/upload/merge',
    method: 'POST',
    data: data,
  });
};