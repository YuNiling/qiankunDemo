<template>
  <div class="map-container">
    <div id="map" ref="mapRef"></div>
    <div class="controls">
      <button @click="startPlayback" :disabled="isPlaying">开始回放</button>
      <button @click="stopPlayback" :disabled="!isPlaying">停止回放</button>
      <button @click="resetPlayback">重置</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';

const mapRef = ref(null);
const map = ref(null);
const isPlaying = ref(false);
const animationFrameId = ref(null);
const currentIndex = ref(0);
const vehicleFeature = ref(null);
const trackFeature = ref(null);

// 模拟轨迹数据
const trackData = [
  { lon: 116.404, lat: 39.915, heading: 0 },
  { lon: 116.405, lat: 39.916, heading: 45 },
  { lon: 116.406, lat: 39.917, heading: 90 },
  { lon: 116.407, lat: 39.918, heading: 135 },
  { lon: 116.408, lat: 39.919, heading: 180 },
  { lon: 116.409, lat: 39.920, heading: 225 },
  { lon: 116.410, lat: 39.921, heading: 270 },
  { lon: 116.411, lat: 39.922, heading: 315 },
];

// 初始化地图
const initMap = () => {
  map.value = new Map({
    target: mapRef.value,
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: [116.404, 39.915],
      zoom: 15
    })
  });

  // 创建轨迹图层
  const trackLayer = new VectorLayer({
    source: new VectorSource()
  });
  map.value.addLayer(trackLayer);

  // 创建轨迹线
  const trackCoordinates = trackData.map(point => [point.lon, point.lat]);
  trackFeature.value = new Feature({
    geometry: new LineString(trackCoordinates)
  });
  trackFeature.value.setStyle(new Style({
    stroke: new Stroke({
      color: '#ff0000',
      width: 2
    })
  }));
  trackLayer.getSource().addFeature(trackFeature.value);

  // 创建车辆图层
  const vehicleLayer = new VectorLayer({
    source: new VectorSource()
  });
  map.value.addLayer(vehicleLayer);

  // 创建车辆图标
  vehicleFeature.value = new Feature({
    geometry: new Point([trackData[0].lon, trackData[0].lat])
  });
  vehicleFeature.value.setStyle(new Style({
    image: new Icon({
      src: 'https://openlayers.org/en/latest/examples/data/car.png',
      scale: 0.5,
      rotation: trackData[0].heading * Math.PI / 180
    })
  }));
  vehicleLayer.getSource().addFeature(vehicleFeature.value);
};

// 计算两点之间的角度（弧度）
const calculateRadian = (currentPos, targetPos) => {
  const dx = targetPos[0] - currentPos[0];
  const dy = targetPos[1] - currentPos[1];
  // 因为车辆图片朝上，所以需要减去90度（π/2弧度）的偏移
  return Math.atan2(dy, dx);
};

// 角度转弧度
const angleToRadian = (angle) => angle * Math.PI / 180;
// 弧度转角度
const radianToAngle = (radian) => radian * 180 / Math.PI;

// 平滑转向算法（弧度）
const smoothRotation = (currentRadian, targetRadian) => {
  let diff = targetRadian - currentRadian;
  
  // 处理角度跨越360度的情况
  if (Math.abs(diff) > Math.PI) {
    diff = diff > 0 ? diff - 2 * Math.PI : diff + 2 * Math.PI;
  }
  
  // 如果角度差小于阈值，直接返回目标角度
  if (Math.abs(diff) < 0.1) {
    return targetRadian;
  }
  
  // 否则进行平滑转向
  const newRadian = currentRadian + diff * 0.1;
  
  // 确保角度在0到2π之间
  return newRadian % (2 * Math.PI);
};

// 根据角度（弧度）和步长计算新位置
const calculateNewPosition = (currentPos, radian, stepSize) => {
  return [
    currentPos[0] + stepSize * Math.cos(radian),
    currentPos[1] + stepSize * Math.sin(radian)
  ];
};

// 动画更新
const updateAnimation = () => {
  if (currentIndex.value >= trackData.length - 1) {
    stopPlayback();
    return;
  }

  const currentPoint = trackData[currentIndex.value];
  const nextPoint = trackData[currentIndex.value + 1];
  
  const currentPosition = vehicleFeature.value.getGeometry().getCoordinates();
  const targetPosition = [nextPoint.lon, nextPoint.lat];
  
  // 计算当前角度和目标角度
  const currentStyle = vehicleFeature.value.getStyle();
  const currentRadian = currentStyle.getImage().getRotation(); // 当前弧度
  const targetRadian = calculateRadian(currentPosition, targetPosition); // 目标弧度
  
  // 平滑转向
  const newRadian = smoothRotation(currentRadian, targetRadian);
  
  // 计算新位置
  const stepSize = 0.0001; // 固定步长
  const newPosition = calculateNewPosition(currentPosition, newRadian, stepSize);
  
  // 更新位置和角度
  vehicleFeature.value.getGeometry().setCoordinates(newPosition);
  // 车辆图片需要减去90度（π/2弧度）的偏移
  currentStyle.getImage().setRotation(newRadian);
  map.value.getView().setCenter(newPosition);
  
  // 检查是否到达目标点
  const distance = Math.sqrt(
    Math.pow(newPosition[0] - targetPosition[0], 2) +
    Math.pow(newPosition[1] - targetPosition[1], 2)
  );
  
  if (distance < 0.0001) {
    console.log('到达目标点', currentIndex.value);
    currentIndex.value++;
  }
  
  animationFrameId.value = requestAnimationFrame(updateAnimation);
};

// 开始回放
const startPlayback = () => {
  if (!isPlaying.value) {
    isPlaying.value = true;
    animationFrameId.value = requestAnimationFrame(updateAnimation);
  }
};

// 停止回放
const stopPlayback = () => {
  if (isPlaying.value) {
    isPlaying.value = false;
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }
  }
};

// 重置回放
const resetPlayback = () => {
  stopPlayback();
  currentIndex.value = 0;
  const firstPoint = trackData[0];
  vehicleFeature.value.getGeometry().setCoordinates([firstPoint.lon, firstPoint.lat]);
  // 初始角度需要考虑车辆朝上的偏移
  vehicleFeature.value.getStyle().getImage().setRotation(angleToRadian(firstPoint.heading) - Math.PI / 2);
  map.value.getView().setCenter([firstPoint.lon, firstPoint.lat]);
};

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  stopPlayback();
  if (map.value) {
    map.value.setTarget(undefined);
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.controls button {
  margin-right: 10px;
}

.controls button:last-child {
  margin-right: 0;
}
</style> 