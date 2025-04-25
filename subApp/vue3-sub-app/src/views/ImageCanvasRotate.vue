<template>
  <div class="row">
    <div class="col">
      <label>初始图片</label>
    </div>
    <div class="col">
      <van-button size="small" :type="imgUrl === img0 ? 'primary' : 'default'" @click="changeImg(0)">图片1</van-button>
    </div>
    <div class="col">
      <van-button size="small" :type="imgUrl === img90 ? 'primary' : 'default'" @click="changeImg(1)">图片2</van-button>
    </div>
    <div class="col">
      <van-button size="small" :type="imgUrl === img180 ? 'primary' : 'default'" @click="changeImg(2)">图片3</van-button>
    </div>
    <div class="col">
      <van-button size="small" :type="imgUrl === img270 ? 'primary' : 'default'" @click="changeImg(3)">图片4</van-button>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <label>旋转角度</label>
    </div>
    <div class="col">
      <van-button size="small" :type="rotate === 0 ? 'primary' : 'default'" @click="rotateEvent(0)">0度</van-button>
    </div>
    <div class="col">
      <van-button size="small" :type="rotate === 90 ? 'primary' : 'default'" @click="rotateEvent(90)">90度</van-button>
    </div>
    <div class="col">
      <van-button size="small" :type="rotate === 180 ? 'primary' : 'default'" @click="rotateEvent(180)">180度</van-button>
    </div>
    <div class="col">
      <van-button size="small" :type="rotate === 270 ? 'primary' : 'default'" @click="rotateEvent(270)">270度</van-button>
    </div>
  </div>
  <van-divider>顺时针旋转{{ rotate }}度后</van-divider>

  <div class="row">
    <div class="col">
      <van-image :src="imgUrl" />
      <p>原图</p>
    </div>
    <div class="col">
      <van-image v-if="rotateImgUrl" :src="rotateImgUrl" />
      <p>图片旋转{{ rotate }} 后</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import img0 from '@/assets/images/0.jpeg';
import img90 from '@/assets/images/90.jpeg';
import img180 from '@/assets/images/180.jpeg';
import img270 from '@/assets/images/270.jpeg';

const imgList = [img0, img90, img180, img270];
const imgUrl = ref<string>(img0);
const rotateImgUrl = ref<string>('');
const rotate = ref <number>(0);
const imgNo = ref<number>(0);

const changeImg = (num: number) => {
  imgNo.value = num;
  imgUrl.value = imgList[num];
};

const rotateEvent = (imgRotate: number) => {
  rotate.value = imgRotate;
  const img = new Image();
  img.src = imgUrl.value;
  img.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let f = 1;
    if ([90, 270].includes(imgRotate)) {
      canvas.width = img.height;
      canvas.height = img.width;
    } else {
      canvas.width = img.width;
      canvas.height = img.height;
    }

    ctx?.save();

    // 弧度 = 角度 * (Math.PI / 180)
    // ctx.rotate(顺时针旋转的弧度);
    // ctx.translate(x,y)  画布原点变成[x, y] x 为正向右移动，y 为正向下移动
    switch(imgRotate) {
      case 0:
        break;
      case 90: 
        ctx?.rotate(Math.PI / 2); // 相当于 90 * (Math.PI / 180)
        ctx?.translate(0, -canvas.width);
        break;
      case 180:
        ctx?.rotate(Math.PI); // 相当于 180 * (Math.PI / 180)
        ctx?.translate(-canvas.width, -canvas.height);  // 
        break;
      case 270:
        ctx?.rotate(-Math.PI / 2); // 相当于 -90 * (Math.PI / 180)
        ctx?.translate(-canvas.height, 0);
        break;
    }
    ctx?.drawImage(img, 0, 0);
    ctx?.restore();

    canvas.toBlob(
      (blob) => {
        const file = new File([blob as Blob], `img${imgRotate}`, {
          type: 'jpeg',
          lastModified: Date.now()
        });
        rotateImgUrl.value = URL.createObjectURL(file) as string|| '';
      },
      'jpeg',
      0.9,
    );

  };
};
</script>

<style scoped lang="less">
.row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px;

  .col {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .van-image {
      width: 45vw;
      border: 1px solid #dcdcdc;
    }

    p {
      text-align: center;
      margin: 0;
      padding: 0;
      // flex: 1;
      width: 100%;
    }
  }
}
</style>