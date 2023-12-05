<!--
 * @Date: 2023-04-19 14:33:23
 * @LastEditTime: 2023-05-22 10:19:33
-->
<template>
  <!-- 头部区域 -->
  <Header />
  <div class="main" id="main">
    <router-view />
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore, useCommonStore } from '@/store/index';
import { Header } from '@/components';

const { proxy } = getCurrentInstance();
const userStore = useUserStore();
const router = useRoute();

watch(
  () => router.name,
  () => {
    document.querySelector('#main').scrollTo({ top: 0 });
  }
);
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 64px;
}

.main {
  width: 100%;
  height: calc(100% - 64px);
}
</style>
