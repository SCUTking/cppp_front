/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-08-02 14:43:25
 */
import axios from 'axios';
import { useUserStore } from '@/store/index';
import { message } from 'ant-design-vue';
import router from '@/router';

const isLocalDev = false,
  baseURL = isLocalDev
    ? process.env.VUE_APP_LOCAL_API_URL
    : process.env.VUE_APP_API_URL;

const request = axios.create({
  baseURL,
  timeout: 60000,
  headers: {},
});

// 异常拦截处理器
const errorHandler = (error) => {
  return Promise.reject(error);
};

request.interceptors.request.use((config) => {
  const counter = useUserStore();
  config.headers.Authorization = counter.token;
  return config;
}, errorHandler);

request.interceptors.response.use((response) => {
  // console.log(response);
  // if (response.config.url.indexOf('downloadStudentWork')) return response.data;
  const { success, resultCode, resultMsg, data } = response.data;
  if (success || resultCode == 600) return { data, resultMsg, resultCode };
  else {
    switch (resultCode) {
      case 401:
        message.warning('登录过期，请重新登录。');
        break;
      case 400:
        if (data && data?.code == 'TOKEN_NOT_VALID') {
          message.warning(data.erroMessage);
          router.push({ path: '/user/login' });
        } else if (response.config.url.indexOf('getWxInfo'))
          return { data, resultCode };
        else message.warning(resultMsg, 2);
        return { data, resultCode };
        break;
      case 301:
      case 500:
        message.warning(resultMsg, 2);
        break;
      default:
        message.warning(resultMsg, 2);
        return { data, resultCode };
        break;
    }
  }
}, errorHandler);

export { request };
