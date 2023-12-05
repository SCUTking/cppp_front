import { request } from '@/request/request';
import { parameterChange } from '@/utils';

export default {
  // 下单
  placeOrder(data) {
    return request({
      url: '/order/order-info/placeOrder',
      method: 'post',
      data,
    });
  },

  // 支付订单
  payOrder(data) {
    return request({
      url: '/order/order-info/payOrder',
      method: 'post',
      data,
    });
  },

  // 查询全部订单
  queryAllOrder(data) {
    return request({
      url: '/order/order-info/queryAllOrder?' + parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 查询某一状态的订单
  queryOrder(data) {
    return request({
      url: '/order/order-info/queryOrder?' + parameterChange(data),
      method: 'get',
      data,
    });
  },
};
