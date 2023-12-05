/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-02-15 09:38:33
 */
import { useCommonStore } from '@/store';
import setupPermissionGuard from './permission';

function setupPageGuard(router) {
  router.beforeEach(() => {
    useCommonStore().s_set_company_logo(null);
    sessionStorage.removeItem('practice_save')
  });
  router.afterEach(() => {});
}

export default function createRouteGuard(router) {
  setupPageGuard(router);
  setupPermissionGuard(router);
}
