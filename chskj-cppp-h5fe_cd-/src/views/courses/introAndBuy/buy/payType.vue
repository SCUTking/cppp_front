<template>
  <div class="pay_type">
    <p class="title">支付方式</p>

    <div class="pay_items">
      <a-radio-group v-model:value="value">
        <div class="pay_item">
          <a-radio :style="radioStyle" :value="1">
            <img
              src="@/assets/course/wechat_pay.png"
              alt="wechat"
              class="pay_icon"
            />
            <span class="pay_text">微信支付</span>
          </a-radio>
        </div>
        <div class="pay_item">
          <a-radio :style="radioStyle" :value="2">
            <img
              src="@/assets/course/Alipay.png"
              alt="Alipay"
              class="pay_icon"
            />
            <span class="pay_text">支付宝</span></a-radio
          >
        </div>
      </a-radio-group>
    </div>

    <div class="bottom">
      <div class="tips">
        * 提交订单则表示您同意
        <p class="value">用户服务协议</p>
      </div>

      <div class="right_content">
        <div class="course_price">
          <p class="label">实付金额</p>
          <p class="unit">￥</p>
          <p class="value">{{ course.sellingPrice ?? 0 }}</p>
        </div>

        <a-button class="buy_btn" @click="$router.push({ name: 'result' })"
          >立即购买</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRef } from 'vue';

const { proxy } = getCurrentInstance();

const props = defineProps({ course: Object }),
  course = toRef(props, 'course');

const value = ref(1);
</script>

<style lang="less" scoped>
.pay_type {
  width: 100%;
  height: 512px;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px 24px 188px 24px;
  box-sizing: border-box;
  margin-top: 24px;

  .title {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: rgba(61, 61, 61, 0.6);
    line-height: 28px;
  }

  .pay_items {
    width: 100%;
    height: fit-content;

    .ant-radio-group {
      width: 100%;

      .pay_item {
        width: 100%;
        height: 80px;
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #dcdcdc;
        display: flex;
        align-items: center;
        margin-top: 24px;

        .ant-radio-wrapper {
          width: 100%;
          height: 80px !important;
          line-height: 80px !important;
          padding: 0 24px;
          box-sizing: border-box;
          margin-right: 0;

          .pay_icon {
            width: 36px;
            height: 36px;
            margin-left: 8px;
          }

          .pay_text {
            font-size: 20px;
            font-weight: 600;
            color: rgba(61, 61, 61, 0.9);
            line-height: 28px;
            margin-left: 16px;
            padding: 4px 0;
            box-sizing: border-box;
          }
        }
      }
    }
  }

  .bottom {
    width: 100%;
    height: fit-content;
    padding-left: 24px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;

    .tips {
      height: 24px;
      font-size: 16px;
      color: rgba(61, 61, 61, 0.898);
      line-height: 24px;
      display: flex;
      align-items: center;

      .value {
        color: #0052d9;
        margin-left: 5px;
      }
    }

    .right_content {
      height: fit-content;
      display: flex;
      align-items: center;

      .course_price {
        height: 32px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(61, 61, 61, 0.6);
        line-height: 22px;
        display: flex;
        align-items: baseline;

        .unit {
          color: #e34d59;
        }
        .value {
          color: #e34d59;
          font-size: 24px;
        }
      }

      .buy_btn {
        width: fit-content;
        height: fit-content;
        background: #0052d9;
        border-radius: 100px;
        padding: 9px 68px 9px 69px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 22px;
        margin-left: 24px;
      }
    }
  }
}
</style>
