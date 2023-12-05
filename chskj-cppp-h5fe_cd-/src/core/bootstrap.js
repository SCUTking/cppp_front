/*
 * @Date: 2022-08-16 09:31:08
 * @LastEditTime: 2023-08-01 17:15:30
 */
import { useUserStore, useCommonStore } from '@/store/index';

// 刷新页面后设置缓存
const Initializer = () => {
  const userStore = useUserStore(),
    commonStore = useCommonStore();

  userStore.s_set_token(sessionStorage.getItem('token'));
  userStore.s_set_user_info(JSON.parse(sessionStorage.getItem('userInfo')));

  commonStore.s_set_pcMapName(sessionStorage.getItem('pcMapName'));
  commonStore.s_set_btn_value(sessionStorage.getItem('btnValue') ?? 0);
};

// 设置为不输出日志（上线使用）
const rewirteLog = () => {
  console.log = (function (log) {
    return process.env.NODE_ENV === 'production' ? function () {} : log;
  })(console.log);
};

export { Initializer, rewirteLog };
