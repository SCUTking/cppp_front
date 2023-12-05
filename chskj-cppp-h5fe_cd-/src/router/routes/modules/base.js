/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-05-16 18:00:57
 */
import BasicLayout from '@/layout/BasicLayout';

export default [
  {
    path: '/',
    redirect: '/classification',
    component: BasicLayout,
    children: [
      {
        path: 'classification',
        name: 'classification',
        redirect: '/classification/category',
        children: [
          {
            path: 'category',
            name: 'category',
            component: () => import('@/views/classification/index.vue'),
          },
          {
            path: 'content',
            name: 'content',
            component: () => import('@/views/classification/content.vue'),
          },
        ],
      },
      {
        path: 'courses',
        name: 'courses',
        redirect: '/courses/learn',
        children: [
          {
            path: 'learn',
            name: 'learn',
            meta: { breadcrumb: true },
            component: () => import('@/views/courses/learn/index.vue'),
          },
          {
            path: 'exam',
            name: 'exam',
            meta: { breadcrumb: true, isHideMyCourseBtn: true },
            component: () => import('@/views/courses/exam/paper/index.vue'),
          },
          {
            path: 'summary',
            name: 'summary',
            meta: { breadcrumb: true, isHideMyCourseBtn: true },
            component: () => import('@/views/courses/exam/summary.vue'),
          },
          {
            path: 'reminder',
            name: 'reminder',
            meta: { breadcrumb: true, isHideMyCourseBtn: true },
            component: () => import('@/views/courses/exam/reminder.vue'),
          },
          {
            path: 'intro',
            name: 'intro',
            component: () =>
              import('@/views/courses/introAndBuy/intro/index.vue'),
          },
          // {
          //   path: 'buy',
          //   name: 'buy',
          //   component: () =>
          //     import('@/views/courses/introAndBuy/buy/index.vue'),
          // },
          // {
          //   path: 'result',
          //   name: 'result',
          //   component: () =>
          //     import('@/views/courses/introAndBuy/buy/result.vue'),
          // },
        ],
      },
      {
        path: 'exercise',
        name: 'exercise',
        redirect: '/exercise/database',
        children: [
          {
            path: 'database',
            name: 'database',
            component: () => import('@/views/exercise/database.vue'),
          },
        ],
      },
      // {
      //   path: 'trainingCenter',
      //   name: 'trainingCenter',
      //   redirect: '/trainingCenter/event',
      //   children: [
      //     {
      //       path: 'event',
      //       name: 'event',
      //       component: () => import('@/views/trainingCenter/index.vue'),
      //     },
      //     {
      //       path: 'topicSet',
      //       name: 'topicSet',
      //       component: () => import('@/views/trainingCenter/topicSet.vue'),
      //     },
      //     {
      //       path: 'paper',
      //       name: 'paper',
      //       component: () => import('@/views/trainingCenter/paper.vue'),
      //     },
      //     {
      //       path: 'score',
      //       name: 'score',
      //       component: () => import('@/views/trainingCenter/score.vue'),
      //     },
      //   ],
      // },
    ],
  },
];
