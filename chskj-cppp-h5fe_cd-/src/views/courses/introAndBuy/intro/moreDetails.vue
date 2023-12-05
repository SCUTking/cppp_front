<template>
  <div class="right_intro">
    <div class="include_knowledge">
      <div class="include">
        <p class="title">本课程包括</p>
        <div class="content">
          <div class="item">
            <img
              src="@/assets/course/in_unit.png"
              alt="in_unit"
              class="in_icon"
            />
            <div class="text">
              <p class="value">{{ statisticsInfo.unit_counts ?? 0 }}</p>
              <p class="label">课程单元</p>
            </div>
          </div>
          <div class="item">
            <img
              src="@/assets/course/in_video.png"
              alt="in_unit"
              class="in_icon"
            />
            <div class="text">
              <p class="value">{{ statisticsInfo.video_counts ?? 0 }}</p>
              <p class="label">学习视频</p>
            </div>
          </div>
          <div class="item">
            <img
              src="@/assets/course/in_data.png"
              alt="in_unit"
              class="in_icon"
            />
            <div class="text">
              <p class="value">{{ statisticsInfo.file_counts ?? 0 }}</p>
              <p class="label">学习资料</p>
            </div>
          </div>
          <div class="item">
            <img
              src="@/assets/course/in_exam.png"
              alt="in_unit"
              class="in_icon"
            />
            <div class="text">
              <p class="value">{{ statisticsInfo.exam_counts ?? 0 }}</p>
              <p class="label">课程考试</p>
            </div>
          </div>
        </div>
      </div>

      <div class="knowledge" v-if="knowledge?.length">
        <p class="title">课程知识点</p>
        <div class="content">
          <Tags :tags="knowledge" label="knowledge" id="ckId" />
        </div>
      </div>
    </div>

    <div :class="['recommend', { recommend_scroll: props.isReachScroll }]">
      <p class="title">更多推荐课程</p>

      <div class="recommend_content">
        <div
          class="recommend_item"
          v-for="course in recommendCourse"
          :key="course.courseId"
          @click="clickRecommend(course)"
        >
          <img :src="course.courseCover" alt="cover" class="recommend_cover" />
          <div class="recommend_right">
            <p class="recommend_title">{{ course.courseName }}</p>
            <p class="statistic">
              共 {{ course.chapterCounts ?? 0 }} 课程课次 /
              {{ course.knowledgeCounts ?? 0 }} 课程知识点
            </p>
          </div>
        </div>
      </div>

      <a-button
        class="more_course_btn"
        @click="$router.push({ name: 'classification' })"
      >
        <span>查看更多课程</span>
        <img src="@/assets/course/arrowBlue.png" alt="more" class="btn_icon" />
      </a-button>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  toRef,
  computed,
} from 'vue';
import { Tags } from '@/components';
import { useUserStore } from '@/store';

const { proxy } = getCurrentInstance();

const userStore = useUserStore();

const props = defineProps({
    isReachScroll: Boolean,
    statisticsInfo: Object,
    courseKnowledge: Array,
  }),
  statisticsInfo = toRef(props, 'statisticsInfo'),
  courseKnowledge = toRef(props, 'courseKnowledge');

const knowledge = computed(() => {
  let mList = [];
  courseKnowledge.value?.forEach((item) => {
    mList.push(item.knowledge);
  });
  return [...new Set(mList)];
});

onMounted(() => {
  getRecommendCourse();
});

const recommendCourse = reactive([]),
  getRecommendCourse = () => {
    const { courseId } = proxy.$router.currentRoute.value.query;
    const stuId = userStore?.userInfo?.stuId;

    let params = { courseId };
    if (stuId) params.stuId = stuId;

    proxy.$api.getRecommendCourse(params).then((res) => {
      if (res.resultCode == 200) {
        res.data.forEach((item) => {
          recommendCourse.push(item);
        });
      }
    });
  },
  clickRecommend = (course) => {
    const { ccId, courseId, isUserBuy } = course;

    const path = isUserBuy ? '/classification/content' : '/courses/intro';
    proxy.$router.push({ path, query: { ccId, courseId } });
  };
</script>

<style lang="less" scoped>
.right_intro {
  width: 384px;
  height: fit-content;

  // 公用title样式
  .title {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    font-weight: 600;
    color: #3d3d3d;
    background: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }

  .include_knowledge {
    width: 100%;
    height: fit-content;
    background: #ffffff;
    border-radius: 8px 8px 0 0;
    padding: 8px 16px 0 16px;
    box-sizing: border-box;

    .include,
    .knowledge {
      width: 100%;
      height: fit-content;
      padding-bottom: 24px;
      box-sizing: border-box;

      .content {
        width: 100%;
        height: fit-content;
        padding-top: 16px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .item {
          width: 50%;
          height: 28px;
          display: flex;
          align-items: center;

          &:nth-of-type(3),
          &:nth-of-type(4) {
            margin-top: 16px;
          }

          .in_icon {
            width: 28px;
            height: 28px;
          }

          .text {
            height: 100%;
            font-size: 16px;
            font-weight: 600;
            color: #00a870;
            display: flex;
            align-items: center;
            margin-left: 6px;

            .value {
              font-size: 20px;
              margin-right: 0.5em;
              line-height: 0;
            }
          }
        }
      }

      .tags {
        padding-left: 0;
      }
    }
  }

  .recommend {
    width: 100%;
    height: fit-content;
    background: #ffffff;
    border-radius: 0 0 8px 8px;
    padding: 0 16px 50px 16px;

    &.recommend_scroll {
      width: 384px;
      position: fixed;
      top: 154px;
      border-radius: 8px;
    }

    .recommend_content {
      width: 100%;
      height: fit-content;
      padding-top: 16px;
      box-sizing: border-box;

      .recommend_item {
        width: 100%;
        height: fit-content;
        display: flex;

        &:hover {
          background: rgba(#f3f3f3, 0.5);
          cursor: pointer;
        }

        &:not(:first-of-type) {
          margin-top: 16px;
        }

        img.recommend_cover {
          width: 160px;
          height: 90px;
          background: rgba(255, 255, 255, 0.01);
        }

        .recommend_right {
          flex: 1;
          height: fit-content;
          margin-left: 8px;

          .recommend_title {
            height: fit-content;
            font-size: 16px;
            font-weight: 600;
            color: #3d3d3d;
            line-height: 24px;
          }

          .statistic {
            width: 166px;
            height: 20px;
            font-size: 12px;
            color: rgba(61, 61, 61, 0.6);
            line-height: 20px;
            margin-top: 8px;
          }
        }
      }
    }

    .more_course_btn {
      width: fit-content;
      height: fit-content;
      background: #f2f3ff;
      border-radius: 20px;
      font-size: 16px;
      color: #0052d9;
      line-height: 24px;
      padding: 8px 24px;
      border: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 40px auto 0 auto;

      .btn_icon {
        width: 18px;
        height: 18px;
        margin-left: 12px;
      }
    }
  }
}
</style>
