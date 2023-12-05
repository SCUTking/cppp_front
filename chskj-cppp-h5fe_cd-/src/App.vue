<!--
 * @Date: 2023-02-14 09:56:13
 * @LastEditTime: 2023-06-12 10:15:40
-->
<template>
  <a-config-provider :locale="locale">
    <router-view :key="route.fullPath" />
  </a-config-provider>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { getCurrentInstance, onMounted } from 'vue';
import { useSseStore } from './store';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

dayjs.locale('zh-cn');

const { proxy } = getCurrentInstance();
const sseStore = useSseStore();
onMounted(() => {
  getConnectId();
});

const getConnectId = () => {
  proxy.$api.getConnectId().then((res) => {
    if (res.resultCode == 200) sseStore.s_set_connect_id(res.data);
  });
};

const locale = zhCN;
const route = useRoute();
</script>
