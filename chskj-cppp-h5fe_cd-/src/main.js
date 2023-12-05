/*
 * @Date: 2022-08-16 09:31:08
 * @LastEditTime: 2023-04-19 16:48:39
 */

import App from './App.vue';
import router from './router';
import api from '@/api';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Initializer, rewirteLog } from '@/core/bootstrap';
import { lazyUse } from '@/core/use';
import 'amfe-flexible'; // rem转化的工具

import './global.css';

const pinia = createPinia();
const app = createApp(App);

// 使用 ant-design-vue 组件
lazyUse(app);
app.use(pinia);
app.use(Initializer);
app.use(rewirteLog);
app.use(router)
// 注册全局api
app.config.globalProperties.$api = api;
app.config.globalProperties.$router = router;
app.mount('#app');
