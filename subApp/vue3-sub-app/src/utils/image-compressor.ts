/**
 * @description 图片压缩处理工具包
 * @date 2025-04-24
 * @author YuNi
 */
import * as exifr from "exifr";

// 判断是否需要压缩, 如果文件大小大于 5MB，则需要压缩
export const shouldCompress = (file: File, maxSize: number = 5 * 1024 * 1024) =>
  file.size > maxSize;

// 根据文件大小动态调整压缩质量，越接近1质量越高，仅对jpeg/webp格式有效
export const getCompressQuality = (file: File, maxSize: number): number => {
  const size = file.size / 1024 / 1024;
  const MIN_QUALITY = 0.6;
  const MAX_QUALITY = 0.9;

  if (size <= maxSize) return 1;

  // ratio 表示文件大小超过5MB的比例，最大为2倍（10MB），超过就按2倍算
  // ratio 范围是 [0, 1]，用于插值压缩质量
  const ratio = Math.min(size / (maxSize * 2), 1);

  // 线性计算压缩质量：
  // 文件越大，ratio 越接近 1，压缩质量越接近 MIN_QUALITY
  return MAX_QUALITY - (MAX_QUALITY - MIN_QUALITY) * ratio;
};

// 处理旋转后的尺寸
export const getRotatedSize = (
  width: number,
  height: number,
  orientation: number,
) => {
  if ([6, 8].includes(orientation)) {
    return {width: height, height: width};
  }
  return {width, height};
};

// 获取 exif 的 orientation 值
export async function getExifOrientation(file: File): Promise<number> {
  const orientation = await exifr.orientation(file);
  return orientation || 1;
}
interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSize?: number;
  quality?: number;
}

// 压缩图片（单个）
export const compresseImage = (
  file: File,
  options: CompressOptions = {},
): Promise<File> => {
  const defaultOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    maxSize: 5 * 1024 * 1024,
    quality: 0.8,
  };

  const opts = {...defaultOptions, ...options};

  return new Promise((resolve, reject) => {
    if (!shouldCompress(file, opts.maxSize)) {
      resolve(file);
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let scale = 1;

      if (!ctx) {
        reject(new Error("Failed to create canvas context"));
        return;
      }

      // 等比例宽度高度
      if (img.width > opts.maxWidth) {
        scale = opts.maxWidth / img.width;
      }
      if (img.height > opts.maxHeight) {
        scale = Math.min(scale, opts.maxHeight / img.height);
      }
      if (file.size > opts.maxSize) {
        scale = Math.min(scale, Math.sqrt(opts.maxSize / file.size));
      }

      const orientation = await getExifOrientation(file);
      let {width, height} = getRotatedSize(img.width, img.height, orientation);

      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.save();

      // 旋转 canvas
      // 弧度 = 角度 * (Math.PI / 180)
      // ctx.rotate(顺时针旋转的弧度);
      switch (orientation) {
        case 3: // 倒置 180度
          ctx.rotate(Math.PI); // 相当于 180 * (Math.PI / 180)
          ctx.translate(-canvas.width, -canvas.height);
          break;
        case 6: // 顺时针旋转 90 度
          ctx.rotate(Math.PI / 2); // 相当于 90 * (Math.PI / 180)
          ctx.translate(0, -canvas.width);
          break;
        case 8: // 逆时针旋转 90 度
          ctx.rotate(-Math.PI / 2); // 相当于 -90 * (Math.PI / 180)
          ctx.translate(-canvas.height, 0);
          break;
        default: // 正常 0度
          break;
      }
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      const quality = getCompressQuality(file, opts.maxSize);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image"));
            return;
          }
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        file.type,
        quality,
      );

      // 释放内存
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));

      // 释放内存
      URL.revokeObjectURL(img.src);
    };
  });
};
