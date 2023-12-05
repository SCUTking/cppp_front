import { sseRequest } from '@/request/sseRequest';
import { parameterChange } from '@/utils';

export default {
  // 获取连接ID
  getConnectId(data) {
    return sseRequest({
      url: '/api_chat/sse/getConnectId',
      method: 'get',
      data,
    });
  },

  // 关闭sse连接
  close(data) {
    return sseRequest({
      url: '/api_chat/sse/close?' + parameterChange(data),
      method: 'get',
    });
  },

  // 发送消息
  sendMessage(data) {
    return sseRequest({
      url: `/api_chat/sse/sendMessage?type=${data.type}&connectId=${data.connectId}`,
      method: 'post',
      data,
    });
  },

  // 上传图片
  uploadImageD(data) {
    return sseRequest({
      url: '/api_chat/sse/uploadImage',
      method: 'post',
      data,
    });
  },

  // 切换连接
  change(data) {
    return sseRequest({
      url: '/api_chat/sse/change?' + parameterChange(data),
      method: 'get',
      data,
    });
  },
};
