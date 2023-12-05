/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-02-15 09:41:06
 */
export default [
  {
    path: '/404',
    component: () => import('@/views/exception/404'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
];
