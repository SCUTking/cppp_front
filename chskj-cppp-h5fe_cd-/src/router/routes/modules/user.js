/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-02-15 09:41:12
 */
import PageLayout from '@/layout/PageLayout';
import BasicLayout from '@/layout/BasicLayout';

export default [
  {
    path: '/user',
    name: 'user',
    component: PageLayout,
    redirect: '/user/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/login'),
      },
    ],
  },
  {
    path: '/user',
    component: BasicLayout,
    children: [
      {
        path: 'personalCenter',
        name: 'personalCenter',
        meta: { breadcrumb: true },
        component: () => import('@/views/user/personalCenter/index'),
      },
      {
        path: 'codeSetDetails',
        name: 'codeSetDetails',
        meta: { breadcrumb: true },
        component: () => import('@/views/user/personalCenter/codeSetDetails'),
      },
    ],
  },
];
