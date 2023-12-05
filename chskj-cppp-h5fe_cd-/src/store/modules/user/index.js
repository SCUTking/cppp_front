/*
 * @Date: 2022-08-16 09:31:08
 * @LastEditTime: 2023-08-02 15:23:20
 */
import router from '@/router';
import api from '@/api';
import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {},
  }),

  getters: {},
  actions: {
    s_set_token(token) {
      this.token = token;
    },
    s_set_user_info(userInfo) {
      this.userInfo = userInfo;
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    login(account = '', password = '', checkCode = '', uuid = '') {
      const params = { account, password, checkCode, uuid };
      return new Promise((resolve, reject) => {
        api.login(params).then((res) => {
          if (res.data) {
            let { token } = res.data;

            this.s_set_user_info(res.data);
            this.token = token;
            sessionStorage.setItem('token', token);
            router.push({ path: '/' });
            message.success('登录成功', 2);
            resolve(true);
          } else resolve(false);
        });
      });
    },
    logout() {
      // api.exitAccount().then(() => {
      // this.token = '';
      // this.userName = '';
      // localStorage.removeItem('token');
      // localStorage.removeItem('userName');
      this.token = {};
      this.userInfo = {};
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('token');
      router.push({ path: '/user/login' });
      message.success('退出成功', 2);
      // });
    },
  },
});

export default useUserStore;
