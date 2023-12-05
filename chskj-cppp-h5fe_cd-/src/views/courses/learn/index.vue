<!--
 * @Date: 2023-05-10 15:30:05
 * @LastEditTime: 2023-05-16 14:04:41
-->
<template>
  <div class="learn">
    <div class="material_box">
      <material :courseChapterContent="courseChapter?.course_chapter_content" />
    </div>

    <div class="interaction_box">
      <div class="header_box">
        <a-button
          class="course_unit_btn"
          type="ghost"
          @click="$router.push({ name: 'content', query: { ccId, courseId } })"
        >
          课程单元
          <template #icon>
            <img src="@/assets/learn/rollback.png" />
          </template>
        </a-button>

        <div class="btn_box">
          <a-button
            :class="{ active_btn: btnValue == 0 }"
            @click="changeValue(0)"
            >课堂学习</a-button
          >
          <a-button
            :class="{ active_btn: btnValue == 1 }"
            @click="changeValue(1)"
            :disabled="!courseChapter?.course_chapter_content?.ifExistWork"
            >课堂作业</a-button
          >
        </div>

        <a-button
          :class="discussVisible ? 'qa_btn_active' : 'qa_btn'"
          @click="openDiscuss"
          shape="round"
        >
          提问/讨论
          <template #icon>
            <img v-if="discussVisible" src="@/assets/learn/arrowUp.png" />
            <img v-else src="@/assets/learn/arrowDown.png" />
          </template>
        </a-button>
      </div>

      <div class="content_box">
        <QuestionDiscuss
          ref="discussRef"
          @handleVisible="(e) => (discussVisible = e)"
        />

        <keep-alive>
          <component
            :is="currentTabComponent"
            :courseChapter="courseChapter"
            :tags="tags"
          ></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive } from 'vue';
import study from '../learn/study/index.vue';
import homework from '../learn/homework/';
import material from './material/material.vue';
import { QuestionDiscuss } from '@/components';
import { useCommonStore, useUserStore } from '@/store';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();
let courseId, chapterId, ccId, unitId;

onMounted(() => {
  courseId = proxy.$route.query.courseId;
  chapterId = proxy.$route.query.chapterId;
  ccId = proxy.$route.query.ccId;
  unitId = proxy.$route.query.unitId;

  const btnValueObj = JSON.parse(commonStore.btnValue);
  if (btnValueObj && btnValueObj.chapterId == chapterId) {
    changeValue(btnValueObj.btn_val);
  }

  getCourseChapter();
  getCourseKnowledge();
  insertStudentChapter();
});
// 插入某课次的学习记录（学生第一次点入某课次时需调用）
const insertStudentChapter = async () => {
  const params = {
    chapterId,
    unitId,
  };
  const res = await proxy.$api.insertStudentChapter(params);
  if (res.resultCode == 200) {
    // console.log(res);
  }
};
const courseChapter = ref();
const getCourseChapter = async () => {
  const params = {
    stuId: userStore.userInfo.stuId,
    courseId,
    chapterId,
  };
  const res = await proxy.$api.getCourseChapter(params);
  if (res.resultCode == 200) {
    courseChapter.value = res.data;

    const { course_chapter_content, companyInfo } = courseChapter.value;
    const { isUserBuy, courseName, unitName, chapterName } =
      course_chapter_content;

    if (!isUserBuy)
      proxy.$router.push({ name: 'intro', query: { ccId, courseId } });

    commonStore.s_set_company_logo(companyInfo?.companyLogo ?? null);
    commonStore.s_set_breadcrumb([
      {
        label: courseName,
        href: `/classification/content?ccId=${ccId}&courseId=${courseId}`,
      },
      { label: unitName },
      { label: chapterName },
    ]);
  }
};

const tags = ref([]),
  getCourseKnowledge = () => {
    proxy.$api.getCourseKnowledge({ chapterId, courseId }).then((res) => {
      if (res.resultCode == 200) tags.value = res.data || [];
    });
  };

const btnValue = ref(0),
  currentTabComponent = ref(study),
  componentMap = { 0: study, 1: homework },
  changeValue = (e) => {
    btnValue.value = e;
    currentTabComponent.value = componentMap[e];
    const obj = { btn_val: e, chapterId };
    commonStore.s_set_btn_value(JSON.stringify(obj));
  };

const discussVisible = ref(false),
  openDiscuss = () => {
    if (!discussVisible.value) proxy.$refs.discussRef.open();
  };
</script>

<style lang="less" scoped>
.learn {
  width: 100%;
  height: 100%;
  display: flex;

  .material_box {
    width: 576px;
    height: 100%;
    background: #ffffff;
  }

  .interaction_box {
    // width: calc(100% - 576px);
    width: 0;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header_box {
      width: 100%;
      height: 56px;
      background: #f9f6d0;
      box-shadow: 0px 1px 0px 0px #e7e7e7;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 17px 8px 16px;
      box-sizing: border-box;

      .course_unit_btn {
        height: 32px;
        background: #ffffff;
        border-radius: 4px;
        border-color: #0052d9;
        color: #0052d9;
        font-size: 14px;
        padding: 2px 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }

      .btn_box {
        width: 172px;
        height: 40px;
        background: #ffffff;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        border-radius: 6px;
        padding: 4px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .ant-btn {
          width: 80px;
          height: 32px;
          background: #ffffff;
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.6);
          border-radius: 4px;
          border: unset;
          padding: 0;

          &.active_btn {
            background: #00a870;
            color: #ffffff;
          }
        }
      }

      .qa_btn,
      .qa_btn_active {
        height: 32px;
        border-radius: 16px;
        padding: 5px 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row-reverse;
        font-size: 12px;

        &.qa_btn {
          border-color: rgba(0, 0, 0, 0.4);
          color: rgba(0, 0, 0, 0.9);
          background: #ffffff;
        }

        &.qa_btn_active {
          border-color: #366ef4;
          color: #0052d9;
          background: #f2f3ff;
        }

        img {
          width: 16px;
          height: 16px;
          margin-left: 4px;
        }
      }
    }

    .content_box {
      width: 100%;
      flex: 1;
    }
  }
}
</style>
