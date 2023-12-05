<!--
 * @Date: 2023-05-16 16:35:54
 * @LastEditTime: 2023-08-01 18:02:33
-->
<template>
  <div class="courseClassify" ref="classifyRef">
    <a-modal
      v-model:visible="visible"
      :closable="false"
      :destroyOnClose="true"
      :footer="null"
      :getContainer="() => $refs.classifyRef"
      placement="left"
      @cancel="onClose"
    >
      <p class="title">课程类别</p>

      <div class="tabs">
        <div class="tabs_nav">
          <div
            v-for="tab in tabs"
            :class="['tabs_tab', { tabs_tab_active: tab.ccId === activeTabId }]"
            :key="tab.ccId"
            @mouseenter="getCourses(tab)"
            @click="clickTab(tab)"
          >
            <img :src="tab.ccIcon" alt="picture" class="pic" />
            <div class="right_box">
              <p class="name">{{ tab.ccName }}</p>
              <p class="num">共{{ tab.courseInfoVoList.length }}门课程</p>
            </div>
          </div>
        </div>
        <div class="tabs_content">
          <a-space direction="vertical">
            <a-tag
              :class="[
                'tag',
                { tag_active: activeCourse.courseId == course.courseId },
              ]"
              v-for="course in courses"
              :key="course"
              @click="clickCourse(course)"
              >{{ course.courseName }}</a-tag
            >
          </a-space>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted, watch } from 'vue';
import { useCommonStore, useUserStore } from '@/store';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();

onMounted(() => {
  if (['content', 'intro'].includes(proxy.$route.name)) mountedAction();
});

watch(
  () => proxy.$route.name,
  (data) => {
    if (['content', 'intro'].includes(data)) mountedAction();
  }
);

const mountedAction = () => {
  const { courseId, ccId } = proxy.$route.query;
  activeTabId.value = Number(ccId);
  activeCourseId.value = Number(courseId);
  getAllCourseClassAndCourseInfo();
};

const emits = defineEmits(['close', 'setCourse']);

const getAllCourseClassAndCourseInfo = () => {
    const stuId = userStore?.userInfo?.stuId;

    const params = {};
    if (stuId) params.stuId = stuId;

    proxy.$api
      .getAllCourseClassAndCourseInfo(params)
      .then((res) => {
        if (res.data) {
          tabs.value = res.data;
          getShowCourses(activeTabId.value);
        }
      })
      .finally(() => {
        getActiveCourse();
      });
  },
  getShowCourses = (ccId) => {
    courses.value =
      tabs.value.find((tab) => tab.ccId == ccId)?.courseInfoVoList ?? [];
  },
  getActiveCourse = () => {
    activeCourse.value =
      courses.value?.find(
        (course) => course.courseId == activeCourseId.value
      ) ?? activeCourse.value;

    emits('setCourse', activeCourse.value);
  };

const visible = ref(false),
  open = () => {
    visible.value = true;
  },
  onClose = () => {
    visible.value = false;
    const { ccId, courseId, isUserBuy } = activeCourse.value;
    let path = '/classification/content';

    if (!isUserBuy) path = '/courses/intro';
    proxy.$router.push({ query: { ccId, courseId }, path });
    emits('setCourse', activeCourse.value);
    emits('close');
  };
defineExpose({ open });

// 下拉框
const tabs = ref([]),
  activeTabId = ref(-1),
  getCourses = (tab) => {
    activeTabId.value = tab.ccId;
    getShowCourses(activeTabId.value);
  },
  clickTab = (course) => {
    proxy.$router.push({ name: 'category' });
    commonStore.s_set_course(course);

    visible.value = false;
  },
  courses = ref([]),
  activeCourseId = ref(-1),
  activeCourse = ref({}),
  clickCourse = (course) => {
    activeCourse.value = course;
    onClose();
  };
</script>

<style lang="less" scoped>
:deep(.ant-modal-mask) {
  opacity: 0 !important;
}

:deep(.ant-modal) {
  width: 791px !important;
  height: 492px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: absolute;
  top: 60px;
  left: 199px;
  margin: 0;
  padding: 24px;

  .ant-modal-content {
    width: 100%;
    height: 100%;
    box-shadow: unset;

    .ant-modal-body {
      width: 100%;
      height: 100%;
      padding: 0;

      .title {
        height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        line-height: 28px;
      }

      .tabs {
        width: 100%;
        height: 400px;
        display: flex;
        margin-top: 16px;

        .tabs_nav {
          width: 190px;
          height: 100%;
          box-shadow: inset -1px 0px 0px 0px #e7e7e7;
          overflow-y: auto;

          &::-webkit-scrollbar {
            width: 0;
          }

          .tabs_tab {
            width: 100%;
            height: 80px;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            cursor: pointer;

            &.tabs_tab_active {
              background: #ecf2fe;
              box-shadow: inset -3px 0px 0px 0px #699ef5;
              transition: all 0.5s ease;
            }

            .pic {
              width: 48px;
              height: 48px;
            }

            .right_box {
              margin-left: 8px;

              .name {
                height: 28px;
                font-size: 20px;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.9);
                line-height: 28px;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
              }

              .num {
                height: 20px;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.6);
                line-height: 20px;
              }
            }
          }
        }

        .tabs_content {
          width: 0;
          flex: 1;
          height: 100%;
          padding: 0 24px;
          box-sizing: border-box;

          .ant-space-vertical {
            flex-direction: row;
            flex-wrap: wrap;

            .tag {
              height: 40px;
              padding: 8px 24px;
              box-sizing: border-box;
              border-radius: 40px;
              border: 1px solid #dcdcdc;
              font-size: 16px;
              margin-right: 0;
              display: flex;
              align-items: center;
              cursor: pointer;

              &:hover {
                background: #ecf2fe;
                border: 1px solid #266fe8;
                color: #266fe8;
              }

              &.tag_active {
                background: #266fe8;
                border: unset;
                color: rgba(255, 255, 255, 0.9);
              }
            }
          }
        }
      }
    }
  }
}
</style>
