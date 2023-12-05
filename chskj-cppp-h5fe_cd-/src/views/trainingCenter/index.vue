<template>
  <div class="training_center">
    <img src="@/assets/bg.png" alt="bg" class="bg" />

    <div class="training_center__container">
      <p class="training_center__tips">请选择编程语言进入练习</p>

      <div
        class="training_center__language"
        v-for="(item, index) in language"
        :key="index"
      >
        <img :src="item.pic" class="training_center__language_cover" />
        <p class="training_center__name">{{ item.name }}</p>
        <p class="training_center__text">编程语言专项习题在线练习</p>
        <a-button
          :class="[
            'training_center__enter_btn',
            { training_center__enter_btn_disabled: !item.flag },
          ]"
          :disabled="!item.flag"
          @click="
            $router.push({
              path: '/trainingCenter/topicSet',
              query: { language: item.name },
            })
          "
          >选择进入</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { useCommonStore } from '@/store';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore();

const language = reactive([
  {
    pic: 'http://cdn.codedancing.cn/cover/96b1a202306061549189895.png',
    name: 'Scratch',
    flag: 1,
  },
  {
    pic: 'http://cdn.codedancing.cn/cover/96b1a202306061549189895.png',
    name: 'Python',
    flag: 1,
  },
  {
    pic: 'http://cdn.codedancing.cn/cover/96b1a202306061549189895.png',
    name: 'C++',
    flag: 0,
  },
]);

commonStore.s_set_breadcrumb([{ label: '练习中心' }]);
</script>

<style lang="less" scoped>
.training_center {
  width: 100%;
  height: 100%;
  position: relative;

  .bg {
    width: 100%;
    height: 100%;
    min-height: 100%;
    position: absolute;
  }

  .training_center__container {
    width: 100%;
    height: fit-content;
    max-height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 56px 244px 0 244px;
    box-sizing: border-box;
    flex-wrap: wrap;
    position: relative;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0;
    }

    .training_center__tips {
      width: 100%;
      height: fit-content;
      font-size: 28px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
      line-height: 56px;
      text-align: center;
      margin-bottom: 48px;
    }

    .training_center__language {
      width: 424px;
      height: 610px;
      background: #ffffff;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      display: flex;
      align-items: center;
      flex-direction: column;

      &:nth-of-type(n + 3) {
        margin-bottom: 24px;
      }

      .training_center__language_cover {
        width: 100%;
        height: 318px;
        border-radius: 16px 16px 0px 0px;
      }

      .training_center__name {
        height: 44px;
        font-size: 36px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        line-height: 44px;
        margin-top: 38px;
      }

      .training_center__text {
        height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.6);
        line-height: 28px;
        margin-top: 24px;
      }

      .training_center__enter_btn {
        width: 320px;
        height: 64px;
        background: #00a870;
        box-shadow: 0px 4px 0px 0px #056334;
        border-radius: 32px;
        font-size: 28px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        line-height: 36px;
        border: unset;
        margin-top: 42px;

        &.training_center__enter_btn_disabled {
          background: #dcdcdc;
          color: rgba(255, 255, 255, 0.9);
          box-shadow: unset;
        }
      }
    }
  }
  // }
}
</style>
