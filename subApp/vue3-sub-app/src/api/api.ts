import { request } from './axios';
import type { ApiResponse, UserInfo } from '@/types';

export const getUserInfo = () => {
  return request({
    url: '/api/users',
    method: 'GET',
  });
};

export const getUserInfoById = (id: number) => {
  return request({
    url: `/api/users/${id}`,
    // url: `/api/users?id=${id}`,
    method: 'GET',
    // params: {
    //   name: '张三',
    //   age: 12
    // },
    // cache: true, // 是否开启缓存，默认缓存5分钟
    // cacheTime: 1 * 60 * 1000, // 缓存1分钟
    // debounce: true, // 是否启用防抖
    // debounceTime: 3000, // 防抖时间，3秒
    retry: 10,
    // retryDelay: 2000
  });
};

export const addUser = (user: UserInfo) => {
  return request({
    url: '/api/users',
    method: 'POST',
    data: user
  });
};

export const uploadImage = (formData: FormData) => {
  return request({
    url: '/api/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};