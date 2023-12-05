<template>
  <div class="intro_buy" ref="introBuyRef">
    <CBreadcrumb />

    <CourseInfo :course="course" :statisticsInfo="statisticsInfo" />

    <div class="intro_details">
      <CourseIntro :course="course" :isReachScroll="isReachScroll" />
      <MoreDetails
        :isReachScroll="isReachScroll"
        :statisticsInfo="statisticsInfo"
        :courseKnowledge="course.courseKnowledgeList"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { useCommonStore, useUserStore } from '@/store';
import { CBreadcrumb } from '../components';
import CourseInfo from './courseInfo.vue';
import CourseIntro from './courseIntro.vue';
import MoreDetails from './moreDetails.vue';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true);

  getCourseInfoWithUnitMessage();

  getCourseStatisticsInfo();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true);
});

let domOffsetTop = 0;
const introBuyRef = ref(),
  isReachScroll = ref(false),
  handleScroll = () => {
    let scrollTop = introBuyRef.value?.scrollTop;
    const recommendDom = document.querySelector('.recommend');
    if (!isReachScroll.value) domOffsetTop = recommendDom.offsetTop;
    isReachScroll.value = scrollTop >= domOffsetTop;
  };

const course = ref({}),
  getCourseInfoWithUnitMessage = () => {
    const { ccId, courseId } = proxy.$router.currentRoute.value.query;
    const stuId = userStore?.userInfo?.stuId;

    let params = { ccId, courseId };
    if (stuId) params.stuId = stuId;

    proxy.$api.getCourseInfoWithUnitMessage(params).then((res) => {
      if (res.data) {
        course.value = res.data;

        const { courseClassName, courseName, isUserBuy } = res.data;

        commonStore.s_set_breadcrumb([
          { label: '华园科创' },
          { label: courseClassName },
          { label: courseName },
        ]);

        // if (isUserBuy)
        //   proxy.$router.push({ name: 'content', query: { ccId, courseId } });
      }
    });
  },
  statisticsInfo = ref({}),
  getCourseStatisticsInfo = () => {
    const { ccId, courseId } = proxy.$router.currentRoute.value.query;
    proxy.$api.getCourseStatisticsInfo({ ccId, courseId }).then((res) => {
      if (res.resultCode == 200) statisticsInfo.value = res.data;
    });
  };
</script>

<style lang="less" scoped>
.intro_buy {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  background: transparent;
  background-image: url('@/assets/bg.png');
  background-size: 100% 866px;
  background-repeat: no-repeat;
  padding: 32px 244px 24px 244px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 0;
  }

  .intro_details {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }
}
</style>
