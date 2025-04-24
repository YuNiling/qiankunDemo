import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  CancelToken,
} from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// 缓存对象结构
interface CacheItem {
  data: any; // 响应数据
  timestamp: number; // 缓存时间戳（毫秒）
  expire: number; // 过期时间（毫秒）
}
interface RequestConfig extends AxiosRequestConfig {
  url: string; // 明确声明 url 为必需属性
  cache?: boolean; // 是否启用缓存
  cacheTime?: number; // 缓存过期时间（毫秒）
  debounce?: boolean; // 是否启用防抖
  debounceTime?: number; // 防抖时间（毫秒）
  retry?: number; // 请求失败时重试次数
  retryDelay?: number; // 重试间隔时间（毫秒）
  retryCount?: number; // 当前重试次数（内部使用）
}
const cacheMap = new Map<string, CacheItem>(); // 内存缓存，key：method + URL + 序列化参数，value：响应数据
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 缓存时间5分钟
const debounceMap = new Map<string, number>(); // 防抖计时器，key：method + URL + 序列化参数，value：timer: 计时器ID
const DEFAULT_DEBOUNCE_TIME = 300; // 防抖时间300毫秒
const cancelMap = new Map<string, any>(); // 取消请求控制器，key：method + URL + 序列化参数，value：controller: 取消请求控制器
const DEFAULT_RETEY_DELAY = 1 * 1000; // 重试间隔1秒

const service = axios.create({
  baseURL: baseURL,
  timeout: 11000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.code === 401) {
      // 未授权
      localStorage.removeItem("token");
      // window.location.href = "/login";
    } else {
      return res;
    }
  },
  async (error) => {
    const {config} = error;
    if (config.retry && config.retry > 0) {
      const retryCount = config.retryCount || 0;
      const retryDelay = config.retryDelay || DEFAULT_RETEY_DELAY;
      if (retryCount < config.retry) {
        config.retryCount = retryCount + 1;
        await new Promise((resolve) => {
          setTimeout(resolve, retryDelay);
        });
        return request(config);
      }
    }
    
    return Promise.reject(error);
  },
);

// 获取唯一 key（method + URL + 序列化参数）
function generateKey(config: RequestConfig, isCache: boolean = false): string {
  const method = (config.method || "get").toUpperCase();
  const normalizedUrl = config.url.includes("?")
    ? config.url.split("?")[0] + "/:param"
    : config.url.replace(/\/(\d+|[a-f0-9]{24,})/gi, "/:param");
  const params = config.params || {};
  const data = typeof config.data === "string" ? JSON.parse(config.data) : {};

  if (isCache) {
    return `${method}?${config.url}?${JSON.stringify(params)}?${JSON.stringify(
      data,
    )}`;
  }
  if (config.debounce) {
    return `${method}?${normalizedUrl}`;
  }
  return `${method}?${config.url}?${JSON.stringify(params)}?${JSON.stringify(
    data,
  )}`;
}

async function handleRequest(
  config: RequestConfig,
  key: string,
  cacheTime: number,
) {
  try {
    if (cancelMap.has(key)) {
      cancelMap.get(key).abort();
      cancelMap.delete(key);
    }

    const cacheKey = generateKey(config, true);

    // 处理缓存
    if (config.cache) {
      const cachedData = cacheMap.get(cacheKey);
      if (cachedData) {
        if (Date.now() - cachedData.timestamp < cachedData.expire) {
          // 未过期
          return {...cachedData.data, __fromCache: true};
        } else {
          // 过期
          cacheMap.delete(key);
        }
      }
    }

    const controller = new AbortController();
    cancelMap.set(key, controller);

    const response = await service({
      ...config,
      signal: controller.signal,
    });

    // 处理缓存
    if (config.cache) {
      cacheMap.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
        expire: cacheTime,
      });
    }
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function request(config: RequestConfig) {
  const key = generateKey(config);
  const cacheTime = config.cacheTime || DEFAULT_CACHE_TIME;
  const debounceTime = config.debounceTime || DEFAULT_DEBOUNCE_TIME;

  // 先处理防抖
  if (config.debounce) {
    // 返回防抖包装的 Promise
    return new Promise((resolve, reject) => {
      // 如果存在防抖记录
      if (debounceMap.has(key)) {
        clearTimeout(debounceMap.get(key));
        debounceMap.delete(key);
        if (cancelMap.has(key)) {
          cancelMap.get(key).abort();
          cancelMap.delete(key);
        }
      }
      // 创建新的计时器
      const timer = setTimeout(async () => {
        try {
          const res = await handleRequest(config, key, cacheTime);
          debounceMap.delete(key);
          cancelMap.delete(key);
          resolve(res);
        } catch (err) {
          if (axios.isCancel(err)) {
            console.log("请求已取消：", err.message);
          } else {
            debounceMap.delete(key);
            cancelMap.delete(key);
            reject(err);
          }
        }
      }, debounceTime);
      // 存储控制器和计时器
      debounceMap.set(key, timer);
    });
  }

  // 普通请求
  return handleRequest(config, key, cacheTime);
}
