/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-02-15 09:41:35
 */
import { createRouter, createWebHistory } from 'vue-router';
import appRoutes from './routes';

import createRouteGuard from './guard';

const routes = appRoutes;
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
