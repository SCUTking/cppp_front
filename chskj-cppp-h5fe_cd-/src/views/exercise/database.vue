<template>
  <div class="database_box">
    <img src="@/assets/bg.png" alt="bg" class="bg_img" />
    <div class="database_main">
      <div class="database_left">
        <statistic v-if="isLoading" :statisticData="statisticData"> </statistic>
        <difficulty v-if="isLoading" :statisticData="statisticData.难度统计">
        </difficulty>
      </div>
      <div class="database_right">
        <knowledgeAndBank />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, computed } from 'vue';
import { useCommonStore, useUserStore } from '@/store';
import { get, set } from '@vueuse/core';
import statistic from './statistic.vue';
import difficulty from './difficulty.vue';
import knowledgeAndBank from './knowledgeAndBank.vue';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();

const isLogin = computed(() => {
  return userStore?.userInfo?.stuId;
});
const isLoading = ref(false);
onMounted(() => {
  if (get(isLogin)) {
    getDoneObjStatisticInfo();
  } else {
    set(isLoading, true);
  }
});

// 获取刷题统计信息
const statisticData = ref({}),
  getDoneObjStatisticInfo = () => {
    const { stuId } = userStore.userInfo;
    proxy.$api.getDoneObjStatisticInfo({ stuId }).then((res) => {
      if (res.resultCode == 200) {
        set(statisticData, res.data);
        set(isLoading, true);
      }
    });
  };
</script>

<style lang="less" scoped>
.database_box {
  position: relative;
}
.bg_img {
  width: 100%;
  height: 866px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
.database_main {
  display: flex;
  justify-content: space-between;
  padding: 24px;
  position: relative;
  z-index: 9;
  .database_left {
    padding: 16px 16px 24px 16px;
    width: 364px;
    background: rgba(255, 255, 255, 0.55);
    border-radius: 16px;
    height: fit-content;
  }
  .database_right {
    width: 1484px;
    height: calc(100vh - 120px);
    overflow: auto;
    opacity: 1;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>
