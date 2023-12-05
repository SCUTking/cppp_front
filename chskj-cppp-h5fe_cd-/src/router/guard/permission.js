/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-08-01 17:07:56
 */
import { useUserStore } from '@/store/index';

const whiteList = ['login', 'category', 'intro', 'database'];

export default function setupPermissionGuard(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (whiteList.includes(to.name)) next();
    else userStore.token ? next() : next({ path: '/user/login' });
  });
}
