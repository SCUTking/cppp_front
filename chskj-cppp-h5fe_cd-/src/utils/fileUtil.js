/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-05-11 11:14:56
 */
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/index';
// import { md5 } from 'md5js';
import dayjs from 'dayjs';

/**
 * @description: 文件下载方式1
 * @param {*} url
 * @return {*}
 */
export function downLoadFile(url) {
  if (!url) {
    message.error('无下载链接');
    return;
  }
  const a = document.createElement('a');
  a.href = `${process.env.VUE_APP_API_URL}/api/other/downLoadFile?file_url=${url}`;
  document.body.appendChild(a);
  a.click();
  return;
}

/**
 * @description: 文件下载方式2
 * @param {*} url
 * @param {*} name
 * @param {*} method
 * @return {*}
 */
export function download(url, name, method = 'get') {
  if (!url) {
    message.error('无下载链接');
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  // xhr.setRequestHeader('token', store.getters.token);
  xhr.responseType = 'blob';
  xhr.onload = (e) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(xhr.response);
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  xhr.send();
}

/**
 * @description: 文件上传
 * @param {*} api
 * @return {*}
 */
export function uploadFile(url, formData, method = 'post') {
  const counter = useUserStore();
  const unix = dayjs().unix();
  const sign = md5(btoa(unix + 'nitouche'), 32);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    xhr.setRequestHeader('iv', unix);
    xhr.setRequestHeader('sign', sign);
    xhr.setRequestHeader('token', counter.token);
    xhr.setRequestHeader('Cache-Control', 'no-cache');

    xhr.send(formData);
    xhr.onload = async function () {
      const res = JSON.parse(xhr.response);
      if (res.code === 200) resolve(res);
      else {
        reject(res);
        message.warning(res.msg, 2);
      }
    };
  });
}
