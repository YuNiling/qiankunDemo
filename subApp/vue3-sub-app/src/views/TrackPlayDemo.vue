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
import { onMounted, onUnmounted, ref } from "vue";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import XYZ from 'ol/source/XYZ';
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import carIcon from "@/assets/images/car.png";

const mapRef = ref(null); // 地图容器
const map = ref(null); // 地图实例
const isPlaying = ref(false); // 是否正在播放
const trackFeature = ref(null); // 轨迹线
const vehicleFeature = ref(null); // 车辆
const animationFrameId = ref(null); // 动画帧id
const currentIndex = ref(0); // 当前索引

// 模拟轨迹数据
const trackData = [
  { lon: 116.40040265479682, lat: 39.90654779440618 },
  { lon: 116.40229512089488, lat: 39.90651564595095 },
  { lon: 116.40409974464774, lat: 39.906545222530326 },
  { lon: 116.4051134520173, lat: 39.906592416437064 },
  { lon: 116.40624266201254, lat: 39.90665581310532 },
  { lon: 116.40835926020142, lat: 39.90675753055794 },
  { lon: 116.40970153817534, lat: 39.90685166085996 },
  { lon: 116.41160389491914, lat: 39.906821698633024 },
  { lon: 116.4116888874173, lat: 39.907990858727885 },
  { lon: 116.41149342143534, lat: 39.90906805775319 },
  { lon: 116.41163943418859, lat: 39.910146268536266 },
  { lon: 116.41152963125704, lat: 39.91129518406848 },
  { lon: 116.41158981332181, lat: 39.91276039309736 },
  { lon: 116.41136249610781, lat: 39.91413363646632 },
  { lon: 116.41284206965564, lat: 39.91416616708494 },
  { lon: 116.41430337065458, lat: 39.91415408061184 },
  { lon: 116.41773039558528, lat: 39.91410869202892 },
  { lon: 116.4198407911658, lat: 39.91423688576779 },
];

const transformCoordinate = (point) => fromLonLat([point.lon, point.lat]);

const initMap = () => {

  map.value = new Map({
    target: mapRef.value,
    layers: [
      // new TileLayer({
      //   source: new OSM(),
      // }),
      new TileLayer({
        source: new XYZ({
          url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attributions:
            '&copy; <a href="https://carto.com/">CARTO</a>',
        }),
      })
    ],
    view: new View({
      center: fromLonLat([116.404, 39.915]),
      zoom: 15,
    }),
  });

  const res = [];
  map.value.on("click", (event) => {
    console.log(toLonLat(event.coordinate));
    res.push({
      lon: toLonLat(event.coordinate)[0],
      lat: toLonLat(event.coordinate)[1],
    });
    console.log(JSON.stringify(res));
  });

  // 创建轨迹图层
  const trackLayer = new VectorLayer({
    source: new VectorSource(),
  });
  map.value.addLayer(trackLayer);

  // 创建轨迹线
  const trackCoordinates = trackData.map((point) => transformCoordinate(point));
  trackFeature.value = new Feature({
    geometry: new LineString(trackCoordinates),
  });
  trackFeature.value.setStyle(
    new Style({
      stroke: new Stroke({
        color: "#ff0000",
        width: 2,
      }),
    }),
  );
  trackLayer.getSource().addFeature(trackFeature.value);

  // 创建车辆图层
  const vehicleLayer = new VectorLayer({
    source: new VectorSource(),
  });
  map.value.addLayer(vehicleLayer);

  // 创建车辆图标
  vehicleFeature.value = new Feature({
    geometry: new Point(transformCoordinate(trackData[0])),
  });
  //
  vehicleFeature.value.setStyle(
    new Style({
      image: new Icon({
        src: carIcon,
        scale: 0.25,
        rotation: angleToRadian(0), // 弧度
        rotateWithView: true,
      }),
    }),
  );
  vehicleLayer.getSource().addFeature(vehicleFeature.value);
};

// 计算两点之间的弧度
const calculateRadian = (currentPoint, targetPoint) => {
  const dx = targetPoint[0] - currentPoint[0];
  const dy = targetPoint[1] - currentPoint[1];
  return Math.atan2(dy, dx);
};

// 角度计算弧度  弧度 = 角度 * (Math.PI / 180)
const angleToRadian = (angle) => angle * Math.PI / 180;
// 弧度计算角度  角度 = （弧度 * 180）/ Math.PI
const radianToAngle = (radian) => radian * 180 / Math.PI;
const MAX_RADIAN = 0.9; // 提高转向速度（原来是 0.1）
const STEP_SIZE = 2; // 调整移动步长

// 平滑转向算法(弧度)
const smoothRotation = (currentRadian, targetRadian) => {
  let diff = targetRadian - currentRadian;


  // 处理角度跨越 180 度的情况
  if (Math.abs(diff) > Math.PI) {
    // 如果diff为正，说明需要反向旋转
    // 如果diff为负，说明需要正向旋转
    diff = diff > 0 ? diff - 2 * Math.PI : diff + 2 * Math.PI;
  }

  // 如果角度差小于阈值，直接返回目标角度
  if (Math.abs(diff) < MAX_RADIAN) {
    return targetRadian;
  }

  // 否则进行平滑转向
  return currentRadian + diff * MAX_RADIAN;
};

// 根据角度和步长计算新位置
const calculateNewPosition = (currentPos, radian, stepSize) => {
  return [
    currentPos[0] + stepSize * Math.cos(radian),
    currentPos[1] + stepSize * Math.sin(radian)
  ];
};
let tt = 0;
// 动画更新
const updateAnimation = () => {
  if (currentIndex.value >= trackData.length - 1) {
    stopPlayback();
    return;
  }

  const nextPoint = trackData[currentIndex.value + 1];
  const currentPosition = vehicleFeature.value.getGeometry().getCoordinates();
  const targetPosition = transformCoordinate(nextPoint);

  // 计算到目标点的方向和距离
  const dxTotal = targetPosition[0] - currentPosition[0];
  const dyTotal = targetPosition[1] - currentPosition[1];
  const distance = Math.hypot(dxTotal, dyTotal);

  // 计算新位置
  let newPosition;
  if (distance <= STEP_SIZE) {
    newPosition = targetPosition;
    currentIndex.value++;
  } else {
    const ratio = STEP_SIZE / distance;
    newPosition = [
      currentPosition[0] + dxTotal * ratio,
      currentPosition[1] + dyTotal * ratio
    ];
  }

  // 更新车辆位置
  vehicleFeature.value.getGeometry().setCoordinates(newPosition);

  // 计算目标旋转角度（调整车辆方向）
  const calRadian = -Math.atan2(dyTotal, dxTotal);

  // 更新车辆方向（直接应用计算值）
  const currentStyle = vehicleFeature.value.getStyle();
  const currentRadian = currentStyle.getImage().getRotation();
  const targetRadian = calRadian + angleToRadian(90);
  const newRadian = smoothRotation(currentRadian, targetRadian);
  currentStyle.getImage().setRotation(newRadian);

  // 中心视角跟随
  map.value.getView().setCenter(newPosition);

  animationFrameId.value = requestAnimationFrame(updateAnimation);
};

const startPlayback = () => {
  if (isPlaying.value) return;
  isPlaying.value = true;
  animationFrameId.value = requestAnimationFrame(updateAnimation);
};

const stopPlayback = () => {
  if (!isPlaying.value) return;
  isPlaying.value = false;
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
};

const resetPlayback = () => {
  stopPlayback();
  currentIndex.value = 0;
  const firstPoint = trackData[currentIndex.value];
  vehicleFeature.value
    .getGeometry()
    .setCoordinates(transformCoordinate(firstPoint));
  vehicleFeature.value
    .getStyle()
    .getImage()
    .setRotation(angleToRadian(0));
  map.value.getView().setCenter(transformCoordinate(firstPoint));
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

<style scoped lang="less">
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
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
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  button {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
