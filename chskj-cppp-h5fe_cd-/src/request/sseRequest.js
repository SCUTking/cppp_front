/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-08-02 14:43:25
 */
import axios from 'axios';
import { message } from 'ant-design-vue';

const request = axios.create({
  baseURL: process.env.VUE_APP_SSE_URL,
  timeout: 60000,
  headers: {},
});

// 异常拦截处理器
const errorHandler = (error) => {
  return Promise.reject(error);
};

request.interceptors.request.use((config) => {
  return config;
}, errorHandler);

request.interceptors.response.use((response) => {
  return response.data;
}, errorHandler);

export { request as sseRequest };
