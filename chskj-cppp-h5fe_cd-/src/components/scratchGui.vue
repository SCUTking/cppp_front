<template>
  <iframe
    class="scratch"
    :src="VUE_APP_SCRATCH_URL"
    ref="scratchRef"
    frameborder="0"
  ></iframe>

  <saveModal
    ref="saveModalRef"
    :language="props.langName"
    :saveName="props.workName"
    :scratchSave="scratchSave"
    :ccId="ccId"
  />
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onActivated,
  onDeactivated,
  onBeforeMount,
  onMounted,
  nextTick,
} from 'vue';
import saveModal from '@/views/courses/learn/study/saveModal.vue';

const { proxy } = getCurrentInstance();

const { VUE_APP_SCRATCH_URL } = process.env;

const props = defineProps({
  langName: String,
  value: String,
  workName: String,
  ccId: String,
});

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onActivated(() => {
  window.addEventListener('message', handleMessage);
  isActivated.value = true;
});

onDeactivated(() => {
  window.removeEventListener('message', handleMessage);
  isActivated.value = false;
  clearInterval(interval);
});

onBeforeMount(() => {
  window.removeEventListener('message', handleMessage);
});

const isActivated = ref(false);

const saveModalRef = ref(null),
  openSaveModal = () => {
    saveModalRef.value?.open();
  };

let interval;
const scratchRef = ref(),
  scratchSave = ref(),
  handleMessage = (e) => {
    if (e.data.constructor !== String) return;

    // console.log('vue接收到的数据======', JSON.parse(e.data));

    if (e.data) {
      const { type, data } = JSON.parse(e.data);
      switch (type) {
        case 'getInitType':
          // 获取type动态展示scratch的header按钮
          postMessage({ type: 'getInitType', data: 'practice' });
          if (props.value) postMessage({ type: 'loadData', data: props.value });
          // 每秒获取最新课堂练习的代码，用于从课堂作业回来之后重载
          if (proxy.$router.currentRoute.value.name == 'learn') {
            postMessage({ type: 'getIsActivated', data: isActivated.value });

            if (sessionStorage.getItem('practice_save'))
              // 先将原来的代码赋值给最新的item项，再进行数据的刷新
              sessionStorage.setItem(
                'practice_save',
                sessionStorage.getItem('practice_save')
              );

            interval = setInterval(() => {
              postMessage({ type: 'getCode' });
            }, 1000);
          }
          break;
        case 'getIsActivated':
          postMessage({
            type: 'loadData',
            data: sessionStorage.getItem('practice_save'),
          });
          break;
        case 'getCode':
          sessionStorage.setItem('practice_save', data);
          break;
        case 'saveCode':
          scratchSave.value = data;
          openSaveModal();
          break;
      }
    }
  },
  postMessage = (message) => {
    const iframeWin = scratchRef.value?.contentWindow;
    iframeWin?.postMessage({ ...message }, '*');
  };
</script>

<style lang="less" scoped>
iframe.scratch {
  width: 100%;
  height: 100%;
  background: url('@/assets/learn/scratch.jpg') no-repeat center;
  background-size: cover;
}
</style>
