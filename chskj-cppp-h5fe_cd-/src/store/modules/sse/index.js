/*
 * @Date: 2022-08-16 09:31:08
 * @LastEditTime: 2023-06-12 17:49:33
 */
import { defineStore } from 'pinia';
import { useCommonStore, useUserStore } from '@/store/index.js';
import * as api from '@/api';

const useSseStore = defineStore('sse', {
  state: () => ({
    chapterId: 0,
    connectId: null,
    isConnected: false,
    arr: [],
  }),
  actions: {
    s_set_connect_id(connectId) {
      this.connectId = connectId;
    },
    s_sse_connect(chapterId) {
      const _this = this;
      if (window.EventSource) {
        const link = () => {
          const url = `${process.env.VUE_APP_SSE_URL}/api_chat/sse/connect?connectId=${_this.connectId}&chapterId=${chapterId}`;
          const source = new EventSource(url);
          return source;
        };
        // 建立连接
        let eventSource = link();
        //  客户端连接服务器
        eventSource.onopen = function (e) {
          _this.chapterId = chapterId;
          _this.isConnected = true;
          setInterval(() => {
            // 心跳检测
            _this.s_sse_message(2);
          }, 60000);
        };
        // 客户端收到服务器发来的数据
        eventSource.onmessage = function (e) {
          if (JSON.parse(e.data)) _this.arr = JSON.parse(e.data);
        };
        // 如果发生通信错误（比如连接中断），就会触发error事件
        eventSource.onerror = function (e) {
          console.log('onerror:', e);
        };
      } else alert('你的浏览器不支持SSE,请切换其他浏览器');
    },
    s_sse_change(chapterId) {
      const params = {
        connectId: this.connectId,
        chapterId,
      };
      api.default.change(params).then((res) => {
        if (res.resultCode == 200) this.chapterId = chapterId;
      });
    },
    // (type：1==正常消息；2==心跳信息)
    s_sse_message(type, contentText) {
      const { avatar, nickname, stuId: userId } = useUserStore().userInfo;
      const { defaultAvatar, defaultName } = useCommonStore();
      const params = {
        userImageUrl: avatar ?? defaultAvatar,
        userName: nickname ?? defaultName,
        connectId: this.connectId,
        chapterId: this.chapterId,
        clientType: 0,
        contentText,
        userId,
        type,
      };
      return new Promise((resolve, reject) => {
        api.default.sendMessage(params).then((res) => {
          if (res.resultCode == 200) if (type == 1) resolve(true);
        });
      });
    },
    s_sse_close() {
      // 断开sse连接
      api.default.close({
        connectId: this.connectId,
        chapterId: this.chapterId,
      });
    },
  },
});

export default useSseStore;
