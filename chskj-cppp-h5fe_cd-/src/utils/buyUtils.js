import * as api from '@/api';
import * as router from '@/router';
import { useCommonStore } from '@/store';

export function go2buy(course) {
  const commonStore = useCommonStore();
  commonStore.s_set_buyLoading(true);
  const { isUserBuy, ccId, courseId } = course;
  if (isUserBuy) {
    router.default.push({
      path: '/classification/content',
      query: { ccId, courseId },
    });
    commonStore.s_set_buyLoading(false);
  }
  // const actualTotal = sellingPrice ?? originalPrice;

  // const commonStore = useCommonStore();
  // commonStore.s_set_buyLoading(true);
  // console.log(actualTotal);

  // router.default.push({ name: 'buy', query: { ccId, courseId, orderId: 1 } });

  // placeOrder({ courseId, actualTotal }).then((res) => {
  //   if (res.resultCode == 200) {
  //     const { orderId } = res.data;
  //     router.default.push({ name: 'buy', query: { ccId, courseId, orderId } });
  //   }
  // });
}

// 下单
function placeOrder({ courseId, actualTotal }) {
  return new Promise((resolve) => {
    api.default
      .placeOrder({ courseId, actualTotal })
      .then((res) => {
        if (res.resultCode == 200) resolve(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        const commonStore = useCommonStore();
        commonStore.s_set_buyLoading(false);
      });
  });
}

// 支付订单
export function payOrder({ orderId }) {}
