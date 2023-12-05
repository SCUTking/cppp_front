<!--
 * @Date: 2023-05-16 11:57:22
 * @LastEditTime: 2023-05-16 14:09:43
-->
<template>
  <div class="difficulty_box">
    <p class="title">难度统计</p>
    <template v-if="isLogin && statisticData">
      <div class="item" v-for="item in difficultyData">
        <div class="text_box">
          <p class="left">
            已通过
            <span class="fz-16" :style="item.color">{{ item.difficulty }}</span
            >难度
            <span class="fz-16" style="color: #0052d9">{{ item.number }}</span
            >/<span class="fz-16" style="color: #029cd4">{{ item.total }}</span>
          </p>
          <p class="right">
            占比
            <span class="fz-16" :style="item.color">{{ item.percentage }}</span>
          </p>
        </div>
        <a-progress
          :percent="(item.number * 100) / item.total"
          :show-info="false"
        />
      </div>
    </template>
    <div class="content" v-else>
      <img src="@/assets/practice/mascot.png" class="img" />
      <a-button class="login" @click="go2login(0)">登录已有账号</a-button>
      <a-button class="register" @click="go2login(1)">立即注册</a-button>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  onMounted,
  computed,
  nextTick,
} from 'vue';
import { get, set } from '@vueuse/core';
import { useCommonStore, useUserStore } from '@/store';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();

const isLogin = computed(() => {
  return userStore?.userInfo?.stuId;
});
const go2login = (isRegister) => {
  if (isRegister) commonStore.s_set_is_register(true);
  proxy.$router.push({ name: 'login' });
};
const props = defineProps({
  statisticData: { type: Object },
});
const difficultyData = ref([]);
onMounted(() => {
  if (get(isLogin)) {
    set(difficultyData, [
      {
        difficulty: '困难',
        total: props.statisticData.困难题数目总数,
        number:
          props.statisticData.困难题数目总数 -
          props.statisticData.未通过困难题数目,
        percentage: props.statisticData.已通过困难题百分比,
        color: 'color: #D54941',
      },
      {
        difficulty: '较难',
        total: props.statisticData.较难题数目总数,
        number:
          props.statisticData.较难题数目总数 -
          props.statisticData.未通过较难题数目,
        percentage: props.statisticData.已通过较难题百分比,
        color: 'color: #F6685D',
      },
      {
        difficulty: '中等',
        total: props.statisticData.中等题数目总数,
        number:
          props.statisticData.中等题数目总数 -
          props.statisticData.未通过中等题数目,
        percentage: props.statisticData.已通过中等题百分比,
        color: 'color: #FA9550',
      },
      {
        difficulty: '较易',
        total: props.statisticData.较易题数目总数,
        number:
          props.statisticData.较易题数目总数 -
          props.statisticData.未通过较易题数目,
        percentage: props.statisticData.已通过较易题百分比,
        color: 'color: #2BA471',
      },
      {
        difficulty: '简单',
        total: props.statisticData.简单题数目总数,
        number:
          props.statisticData.简单题数目总数 -
          props.statisticData.未通过简单题数目,
        percentage: props.statisticData.已通过简单题百分比,
        color: 'color: #2BA471',
      },
    ]);
    console.log(get(difficultyData));
  }
});
</script>

<style lang="less" scoped>
.difficulty_box {
  padding: 16px;
  width: 332px;
  background: #ffffff;
  border-radius: 8px;
  .content {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .item {
    margin-bottom: 12px;
  }
  .text_box {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 20px;
    .fz-16 {
      font-size: 16px;
    }
  }
  .img {
    margin-top: 20px;
    width: 128px;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    line-height: 28px;
    margin-bottom: 14px;
  }
  .text1 {
    margin-top: 8px;
    font-size: 14px;
    color: #3d3d3d;
    line-height: 22px;
    // text-align: center;
  }
  .login {
    margin: 24px 0 16px 0;
    width: 252px;
    height: 40px;
    background: #0052d9;
    border-radius: 3px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
  }
  .register {
    margin-bottom: 42px;
    width: 252px;
    height: 40px;
    background: #2ba471;
    border-radius: 3px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
  }
}
</style>
