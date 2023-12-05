<template>
  <vue3videoPlay
    @play="onPlay"
    v-if="props.videoSrc"
    v-bind="options"
    :src="props.videoSrc"
    style="width= 100%; height=100%; object-fit: cover"
  />
</template>
<script setup>
import { ref } from 'vue';

import vue3videoPlay from 'vue3-video-play';
import 'vue3-video-play/dist/style.css';

const props = defineProps({
  videoSrc: { type: String, default: '' },
});
const emit = defineEmits(['onPlay']);

const onPlay = () => {
  emit('onPlay');
};
// 视频选项
const options = ref({
  width: '100%', //播放器高度
  height: '100%', //播放器高度
  color: '#409eff', //主题色
  muted: true, //静音
  webFullScreen: false,
  speedRate: ['0.5','0.75', '1.0', '1.25', '1.5', '2.0'], //播放倍速
  autoPlay: false, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制
  controlBtns: [
    'audioTrack',
    'quality',
    'volume',
    'setting',
    'pip',
    'pageFullScreen',
    'fullScreen',
    'speedRate',
  ], //显示所有按钮,
});
</script>
<style lang="less" scoped>
:deep(.d-control-tool) {
  background: rgba(0, 0, 0, 0.3) !important;
}
:deep(.d-slider__runway) {
  background: rgba(0, 0, 0, 0.1) !important;
}
:deep(.d-slider__preload) {
  display: none;
}
</style>
