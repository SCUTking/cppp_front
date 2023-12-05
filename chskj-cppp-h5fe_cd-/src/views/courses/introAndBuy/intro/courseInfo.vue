<template>
  <div class="intro_info">
    <img :src="course.courseCover" alt="cover" class="course_cover" />

    <div class="course_info_box">
      <p class="course_name">{{ course.courseName }}</p>
      <p class="course_intro">{{ course.courseIntro }}</p>
      <div class="course_content">
        <div class="course_num_box">
          课次数：
          <p class="value">{{ statisticsInfo.chapter_counts ?? 0 }}</p>
          &nbsp;节
        </div>
        <div class="course_time_box">
          总课时：
          <p class="value">{{ statisticsInfo.video_time_total ?? 0 }}</p>
          &nbsp;小时
        </div>
      </div>
      <div class="course_price">
        <div class="selling_price">
          ￥
          <p class="value">{{ course.sellingPrice ?? 0 }}</p>
        </div>
        <div class="original_price">
          ￥
          <p class="value">{{ course.originalPrice ?? 0 }}</p>
        </div>
      </div>
      <a-button
        class="buy_btn"
        @click="go2buy(course)"
        :loading="commonStore.buyLoading"
        >{{ course.isUserBuy ? '进入学习' : '立即购买' }}</a-button
      >

      <buyModal />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRef } from 'vue';
import { go2buy } from '@/utils';
import { useCommonStore } from '@/store';
import buyModal from '../buy/buyModal.vue';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore();

const props = defineProps({
    course: Object,
    statisticsInfo: Object,
  }),
  course = toRef(props, 'course'),
  statisticsInfo = toRef(props, 'statisticsInfo');
</script>

<style lang="less" scoped>
.intro_info {
  width: 100%;
  height: fit-content;
  min-height: 271px;
  background: rgba(255, 255, 255, 0.65);
  border-radius: 8px;
  margin-top: 16px;
  padding: 32px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .course_cover {
    width: 368px;
    height: 100%;
    background: rgba(255, 255, 255, 0.01);
  }

  .course_info_box {
    flex: 1;
    height: 100%;
    margin-left: 24px;

    .course_name {
      width: 100%;
      height: 44px;
      font-size: 36px;
      font-weight: 600;
      color: #3d3d3d;
      line-height: 44px;
    }

    .course_intro {
      width: 100%;
      height: fit-content;
      min-height: 22px;
      font-size: 14px;
      font-weight: 600;
      color: #3d3d3d;
      line-height: 22px;
      margin-top: 8px;
    }

    .course_content {
      width: 100%;
      height: 28px;
      display: flex;
      align-items: center;
      margin-top: 8px;

      .course_num_box {
        width: fit-content;
        height: 100%;
        font-size: 14px;
        font-weight: 600;
        color: #3d3d3d;
        line-height: 22px;
        display: flex;
        align-items: baseline;
      }

      .course_time_box {
        width: fit-content;
        height: 28px;
        font-size: 14px;
        font-weight: 600;
        color: #3d3d3d;
        line-height: 22px;
        margin-left: 24px;
        display: flex;
        align-items: baseline;
      }

      .value {
        font-size: 20px;
      }
    }

    .course_price {
      width: fit-content;
      height: 32px;
      display: flex;
      align-items: baseline;
      margin-top: 8px;

      .selling_price,
      .original_price {
        width: fit-content;
        height: 100%;
        font-size: 14px;
        font-weight: 600;
        color: #e34d59;
        line-height: 22px;
        display: flex;
        align-items: baseline;

        &.original_price {
          color: rgba(#3d3d3d, 0.6);
          text-decoration: line-through;
          margin-left: 5px;
        }

        &.selling_price .value {
          font-size: 24px;
        }
      }
    }

    .buy_btn {
      width: fit-content;
      height: fit-content;
      background: #0052d9;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 22px;
      border-radius: 100px;
      padding: 9px 32px;
      margin-top: 17px;
    }
  }
}
</style>
