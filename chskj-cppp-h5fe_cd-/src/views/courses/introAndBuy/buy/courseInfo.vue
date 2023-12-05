<template>
  <div class="course_info">
    <img :src="course.courseCover" alt="cover" class="course_cover" />

    <div class="course_info_box">
      <p class="course_name">{{ course.courseName }}</p>
      <div class="label_value">
        课程类别
        <p class="value">{{ course.courseClassName }}</p>
      </div>
      <p class="label_value">课程有效期 <p class="value">付款后一年内有效</p></p>
      <div class="course_price">
        课程价格
        <div class="selling_price">
          ￥
          <p class="value">{{ course.sellingPrice ?? 0 }}</p>
        </div>
        <div class="original_price">
          ￥
          <p class="value">{{ course.originalPrice ?? 0 }}</p>
        </div>
      </div>
      <p class="label_value">注意：购买后不支持退款、转让，请在 30分钟 内完成支付，否则订单将被自动取消。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRef } from 'vue';
import { useCommonStore } from '@/store';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore();

const props = defineProps({ course: Object }),
  course = toRef(props, 'course');
</script>

<style lang="less" scoped>
.course_info {
  width: 100%;
  height: 271px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  padding: 32px 24px;
  box-sizing: border-box;
  margin-top: 32px;

  .course_cover {
    width: 368px;
    height: 100%;
  }

  .course_info_box {
    flex: 1;
    height: 100%;
    padding-left: 24px;
    box-sizing: border-box;

    .course_name {
      font-size: 36px;
      font-weight: 600;
      color: #3d3d3d;
      line-height: 44px;
    }

    .label_value {
      height: 28px;
      font-size: 14px;
      color: rgba(61, 61, 61, 0.6);
      line-height: 22px;
      display: flex;
      align-items: baseline;
      margin-top: 14px;

      .value {
        color: #3d3d3d;
        font-size: 20px;
        margin-left: 10px;
      }
    }

    .course_price {
      width: fit-content;
      height: 32px;
      display: flex;
      align-items: baseline;
      color: rgba(61,61,61,0.6);
      margin-top: 9px;

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
          color: rgba(61,61,61,0.6);
          text-decoration: line-through;
          margin-left: 5px;
        }

        &.selling_price .value {
          font-size: 24px;
        }
      }
    }
  }
}
</style>
