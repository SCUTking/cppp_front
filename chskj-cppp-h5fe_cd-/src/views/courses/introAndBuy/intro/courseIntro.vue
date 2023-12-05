<template>
  <div class="fixed_box" v-if="isReachScroll">
    <div class="tabs">
      <div
        :class="['tab', { active_tab: tab.id == activeTab.id }]"
        v-for="tab in tabs"
        @click="clickTab(tab)"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="right_content">
      <div class="course_price">
        <div class="selling_price">
          ￥
          <p class="value">{{ course.sellingPrice }}</p>
        </div>
        <div class="original_price">
          ￥
          <p class="value">{{ course.originalPrice }}</p>
        </div>
      </div>

      <a-button
        class="fixed_buy_btn"
        @click="go2buy(course)"
        :loading="commonStore.buyLoading"
        >{{ course.isUserBuy ? '进入学习' : '立即购买' }}</a-button
      >
    </div>
  </div>

  <div class="left_intro">
    <div class="tabs">
      <div
        :class="['tab', { active_tab: tab.id == activeTab.id }]"
        v-for="tab in tabs"
        @click="clickTab(tab)"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="content">
      <!-- 课程介绍 -->
      <TabIntro :description="course.courseDescribe" v-if="activeTab.id == 1" />
      <!-- 课程目录 -->
      <TabTOC
        :unitInfoVo="course.unitInfoVoList"
        :isUserBuy="course.isUserBuy"
        v-else
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, toRef } from 'vue';
import { go2buy } from '@/utils';
import { useCommonStore } from '@/store';
import TabIntro from './tabIntro.vue';
import TabTOC from './tabDirectory.vue';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore();

const props = defineProps({
    course: { type: Object, default: {} },
    isReachScroll: Boolean,
  }),
  course = toRef(props, 'course');

onMounted(() => {
  activeTab.value = tabs[0];
});

const tabs = reactive([
    { id: 1, label: '课程介绍' },
    { id: 2, label: '课程目录' },
  ]),
  activeTab = ref({}),
  clickTab = (tab) => {
    activeTab.value = tab;
    document
      .querySelector('.intro_buy')
      .scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<style lang="less" scoped>
.fixed_box {
  width: 1920px;
  height: 72px;
  background: #ffffff;
  border-bottom: 0.00521rem solid rgba(60, 60, 67, 0.18);
  position: fixed;
  top: 64px;
  left: 0;
  padding: 4px 244px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  z-index: 5;

  .tabs {
    height: fit-content;
    display: flex;
    justify-content: center;
    justify-content: space-between;
    padding-left: 396px;

    .tab {
      width: 112px;
      height: 100%;
      line-height: 64px;
      text-align: center;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.9);
      background: #ffffff;
      cursor: pointer;

      &:nth-of-type(2) {
        margin-left: 16px;
      }

      &.active_tab {
        color: #0052d9;
        position: relative;

        &::after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          content: '';
          background: #0052d9;
        }
      }
    }
  }

  .right_content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .course_price {
      width: fit-content;
      height: 32px;
      display: flex;
      align-items: baseline;

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

    .fixed_buy_btn {
      width: 193px;
      height: 40px;
      background: #0052d9;
      border-radius: 100px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 22px;
      margin-left: 39px;
    }
  }
}

.left_intro {
  width: 1032px;
  height: fit-content;
  min-height: 980px;
  background: #ffffff;
  border-radius: 8px;

  .tabs {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    margin-top: 16px;

    .tab {
      width: 112px;
      height: 64px;
      line-height: 64px;
      text-align: center;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.9);
      background: #ffffff;
      cursor: pointer;

      &:nth-of-type(2) {
        margin-left: 16px;
      }

      &.active_tab {
        color: #0052d9;
        position: relative;

        &::after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          content: '';
          background: #0052d9;
        }
      }
    }
  }

  .content {
    width: 100%;
    height: fit-content;
    margin-top: 24px;
  }
}
</style>
