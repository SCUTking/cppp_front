<template>
  <div class="buy">
    <CBreadcrumb />

    <CourseInfo :course="course" />

    <PayType :course="course" />
  </div>
</template>

<script setup>
import { useCommonStore, useUserStore } from '@/store';
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { CBreadcrumb } from '../components';
import CourseInfo from './courseInfo.vue';
import PayType from './payType.vue';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

onMounted(() => {
  // getCourseInfoWithUnitMessage();
  commonStore.s_set_breadcrumb([
    { label: '华园科创' },
    { label: '课程中心' },
    { label: '确认订单' },
  ]);

  course.value = {
    courseId: 16,
    ccId: 8,
    courseCover: 'http://cdn.codedancing.cn/cover/96bdf202308081714171366.png',
    courseName: 'Scratch高级',
    courseIntro:
      '初级篇是这个课类的入门篇，通过让同学们编写有趣的故事和小游戏来熟悉Scratch编程平台。',
    courseDescribe:
      '<p><img src="http://cdn.codedancing.cn/cover/61000202308101604134594.png" alt="" data-href="" style=""/></p><p><img src="http://cdn.codedancing.cn/cover/b6109202308101604173111.png" alt="" data-href="" style=""/></p><p><img src="http://cdn.codedancing.cn/cover/ae851202308101604222562.png" alt="" data-href="" style=""/></p>',
    originalPrice: 368,
    sellingPrice: 299.2,
    sales: 0,
    createTime: '2023-08-08T17:14:48',
    updateTime: '2023-08-10T16:04:23',
    isUserBuy: false,
    learnProgress: '0%',
    courseClassName: 'Scratch',
    unitInfoVoList: [
      {
        unitId: 32,
        courseId: 16,
        unitName: '第一单元',
        createTime: '2023-08-14T15:22:24',
        updateTime: '2023-08-14T16:00:21',
        unitType: 0,
        courseChapterVoList: [
          {
            chapterId: 14,
            chapterCover:
              'http://cdn.codedancing.cn/cover/97d61202308141523002653.png',
            chapterName: '什么是Scratch',
            chapterType: 1,
            unitId: 32,
            unitName: '第一单元',
            courseId: 16,
            courseName: 'Scratch高级',
            ccId: 8,
            ccName: 'Scratch',
            createTime: '2023-08-14T15:23:44',
            updateTime: '2023-08-14T16:01:35',
          },
          {
            chapterId: 17,
            chapterCover:
              'http://cdn.codedancing.cn/cover/732da202308141602009748.png',
            chapterName: '组件',
            chapterType: 1,
            unitId: 32,
            unitName: '第一单元',
            courseId: 16,
            courseName: 'Scratch高级',
            ccId: 8,
            ccName: 'Scratch',
            createTime: '2023-08-14T16:02:11',
            updateTime: '2023-08-14T16:02:11',
          },
          {
            chapterId: 19,
            chapterCover:
              'http://cdn.codedancing.cn/cover/e9b80202308141607313511.png',
            chapterName: '程序',
            chapterType: 1,
            unitId: 32,
            unitName: '第一单元',
            courseId: 16,
            courseName: 'Scratch高级',
            ccId: 8,
            ccName: 'Scratch',
            createTime: '2023-08-14T16:07:43',
            updateTime: '2023-08-14T16:07:43',
          },
          {
            chapterId: 20,
            chapterCover:
              'http://cdn.codedancing.cn/cover/100fd20230814160758800.png',
            chapterName: 'Scratch FlappyBird 游戏实践教学',
            chapterType: 1,
            unitId: 32,
            unitName: '第一单元',
            courseId: 16,
            courseName: 'Scratch高级',
            ccId: 8,
            ccName: 'Scratch',
            createTime: '2023-08-14T16:08:01',
            updateTime: '2023-08-14T16:08:01',
          },
          {
            chapterId: 21,
            chapterCover:
              'http://cdn.codedancing.cn/cover/1fc9b202308141608285995.png',
            chapterName: '单元测试',
            chapterType: 2,
            unitId: 32,
            unitName: '第一单元',
            courseId: 16,
            courseName: 'Scratch高级',
            ccId: 8,
            ccName: 'Scratch',
            createTime: '2023-08-14T16:08:37',
            updateTime: '2023-08-14T16:08:37',
          },
        ],
        unitKnowledgeList: [
          {
            ckId: 44,
            knowledgeId: 22,
            knowledge: '运动',
            chapterId: 17,
            unitId: 32,
            courseId: 16,
            ccId: 8,
          },
          {
            ckId: 46,
            knowledgeId: 22,
            knowledge: '运动',
            chapterId: 14,
            unitId: 32,
            courseId: 16,
            ccId: 8,
          },
        ],
      },
      {
        unitId: 33,
        courseId: 16,
        unitName: '第二单元',
        createTime: '2023-08-14T15:22:33',
        updateTime: '2023-08-14T15:22:33',
        unitType: 0,
        courseChapterVoList: [
          {
            chapterId: 15,
            chapterCover:
              'http://cdn.codedancing.cn/cover/c9f4a202308141525239642.png',
            chapterName: '什么是Scratch',
            chapterType: 1,
            unitId: 33,
            unitName: '第二单元',
            courseId: 16,
            courseName: 'Scratch高级',
            ccId: 8,
            ccName: 'Scratch',
            createTime: '2023-08-14T15:25:44',
            updateTime: '2023-08-14T15:25:44',
          },
          {
            chapterId: 16,
            chapterCover:
              'http://cdn.codedancing.cn/cover/4f4be202308141532256779.png',
            chapterName: '单元测试名称',
            chapterType: 2,
            unitId: 33,
            unitName: '第二单元',
            courseId: 16,
            courseName: 'Scratch高级',
            ccId: 8,
            ccName: 'Scratch',
            createTime: '2023-08-14T15:32:43',
            updateTime: '2023-08-14T15:32:43',
          },
        ],
        unitKnowledgeList: [
          {
            ckId: 45,
            knowledgeId: 22,
            knowledge: '运动',
            chapterId: 15,
            unitId: 33,
            courseId: 16,
            ccId: 8,
          },
        ],
      },
      {
        unitId: 34,
        courseId: 16,
        unitName: '期中考试',
        createTime: '2023-08-14T15:22:39',
        updateTime: '2023-08-14T16:00:32',
        unitType: 1,
        courseChapterVoList: [
          {
            chapterId: 18,
            chapterCover:
              'http://cdn.codedancing.cn/cover/e1a77202308141602374072.png',
            chapterName: '期中考试',
            chapterType: 3,
            unitId: 34,
            unitName: '期中考试',
            courseId: 16,
            courseName: 'Scratch高级',
            ccId: 8,
            ccName: 'Scratch',
            createTime: '2023-08-14T16:03:21',
            updateTime: '2023-08-14T16:03:21',
          },
        ],
        unitKnowledgeList: null,
      },
      {
        unitId: 35,
        courseId: 16,
        unitName: '第四单元',
        createTime: '2023-08-14T16:09:34',
        updateTime: '2023-08-14T16:09:34',
        unitType: 0,
        courseChapterVoList: [
          {
            chapterId: 22,
            chapterCover:
              'http://cdn.codedancing.cn/cover/cce7e202308141609417589.png',
            chapterName: '课次',
            chapterType: 1,
            unitId: 35,
            unitName: '第四单元',
            courseId: 16,
            courseName: 'Scratch高级',
            ccId: 8,
            ccName: 'Scratch',
            createTime: '2023-08-14T16:09:56',
            updateTime: '2023-08-14T16:09:56',
          },
        ],
        unitKnowledgeList: null,
      },
    ],
    courseKnowledgeList: [
      {
        ckId: 44,
        knowledgeId: 22,
        knowledge: '运动',
        chapterId: 17,
        unitId: 32,
        courseId: 16,
        ccId: 8,
      },
      {
        ckId: 45,
        knowledgeId: 22,
        knowledge: '运动',
        chapterId: 15,
        unitId: 33,
        courseId: 16,
        ccId: 8,
      },
      {
        ckId: 46,
        knowledgeId: 22,
        knowledge: '运动',
        chapterId: 14,
        unitId: 32,
        courseId: 16,
        ccId: 8,
      },
    ],
  };
});

const course = ref({}),
  getCourseInfoWithUnitMessage = () => {
    const { stuId } = userStore.userInfo;
    const { ccId, courseId } = proxy.$router.currentRoute.value.query;

    proxy.$api
      .getCourseInfoWithUnitMessage({ stuId, ccId, courseId })
      .then((res) => {
        if (res.data) {
          course.value = res.data;

          commonStore.s_set_breadcrumb([
            { label: '华园科创' },
            { label: '课程中心' },
            { label: '确认订单' },
          ]);
        }
      });
  };
</script>

<style lang="less" scoped>
.buy {
  width: 100%;
  height: 100%;
  padding: 32px 244px 153px 244px;
  box-sizing: border-box;
  overflow-y: auto;
  background: transparent;
  background-image: url('@/assets/bg.png');
  background-size: 100% 866px;
  background-repeat: no-repeat;

  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
