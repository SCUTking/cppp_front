<!--
 * @Date: 2023-05-16 18:01:06
 * @LastEditTime: 2023-06-08 14:28:45
-->
<template>
  <div class="topicset">
    <img src="@/assets/bg.png" alt="" class="topicset__bg" />

    <div class="topicset__container">
      <div class="topicset__top_action">
        <a-button
          class="topicset__reselect_btn"
          @click="$router.push('/trainingCenter')"
        >
          <img
            src="@/assets/trainingCenter/arrow_left_blue.png"
            alt="arrow"
            class="topicset__btn_icon"
          />
          <span>重新选择</span>
        </a-button>

        <p class="topicset__select_tips">请选择题集进入练习</p>
      </div>

      <template v-if="loading">
        <div class="topicset__item" v-for="item in 4" :key="item">
          <a-skeleton-image class="topicset__item__left_box" />
          <a-skeleton
            class="topicset__item__right_box"
            :paragraph="{ rows: 4 }"
            :active="true"
          />
        </div>
      </template>
      <template v-else>
        <div class="topicset__item" v-for="item in topicSet" :key="item.id">
          <div class="topicset__item__left_box">
            <img
              src="@/assets/trainingCenter/topic_set.png"
              alt=""
              class="topicset__item__img"
            />
          </div>

          <div class="topicset__item__right_box">
            <p class="topicset__item__title">{{ item.title }}</p>
            <p class="topicset__item__knowledge">{{ item.knowledge }}</p>
            <div class="topicset__item__btns">
              <a-button
                :class="[
                  'topicset__item__btn',
                  { topicset__item__btn_blue: i.type },
                ]"
                v-for="i in item.sets"
                :key="index"
                >进入练习（{{ i.title }}）</a-button
              >
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue';
import { useCommonStore } from '@/store';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore();

commonStore.s_set_breadcrumb([
  { label: '练习中心', href: '/trainingCenter' },
  { label: proxy.$route.query.language + '题集练习' },
]);

const loading = ref(true),
  topicSet = reactive([
    {
      id: 1,
      title: 'Python题集 - 基础语法',
      knowledge: '知识点',
      sets: [
        { type: 0, title: '客观题01' },
        { type: 0, title: '客观题12' },
        { type: 1, title: '编译题02' },
      ],
    },
    {
      id: 2,
      title: 'Python题集 - 面向对象编程',
      knowledge:
        '让用户了解类和对象的概念、封装、继承、多态等面向对象编程的基本原理，其中编译题包括：编写代码、代码分析、代码优化等。',
      sets: [{ type: 1, title: '编译题01' }],
    },
    {
      id: 3,
      title: 'Python题集 - 模拟练习',
      knowledge:
        'Python 编程语言专项练习题集，其中客观题包括：单项选择题、多项选择题和判断题等。',
      sets: [{ type: 0, title: '客观题02' }],
    },
    {
      id: 4,
      title: 'Python题集 - 数据库操作',
      knowledge:
        '教授用户如何使用Python操作关系型数据库（如SQLite、MySQL、PostgreSQL）和非关系型数据库（如MongoDB、Redis），其中客观题包括：单项选择题、多项选择题和判断题等；编译题包括：编写代码、代码分析、代码优化等。',
      sets: [
        { type: 0, title: '客观题01' },
        { type: 0, title: '客观题12' },
        { type: 0, title: '客观题17' },
        { type: 0, title: '客观题20' },
        { type: 0, title: '客观题23' },
        { type: 1, title: '编译题02' },
        { type: 1, title: '编译题02' },
      ],
    },
  ]);

setTimeout(() => {
  loading.value = false;
}, 4000);
</script>

<style lang="less" scoped>
.topicset {
  width: 100%;
  height: 100%;
  background: #ecf2fe;
  padding: 56px 100px 180px 100px;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 0;
  }

  .topicset__bg {
    width: 100%;
    height: 866px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .topicset__container {
    width: 100%;
    height: fit-content;
    position: relative;

    .topicset__top_action {
      width: 100%;
      height: 56px;
      display: flex;
      align-items: center;
      position: relative;

      .topicset__reselect_btn {
        width: 180px;
        height: 100%;
        background: #ffffff;
        border-radius: 29px;
        border: unset;
        font-size: 20px;
        font-weight: 600;
        color: #0052d9;
        line-height: 36px;

        .topicset__btn_icon {
          width: 36px;
          height: 36px;
          margin-right: 8px;
        }
      }

      .topicset__select_tips {
        height: 100%;
        font-size: 28px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.6);
        line-height: 56px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .topicset__item {
      width: 100%;
      height: fit-content;
      background: #ffffff;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      margin-top: 24px;
      display: flex;

      .topicset__item__left_box {
        width: 320px;
        height: auto;
        background: #bcebdc;
        border-radius: 16px 0px 0px 16px;
        display: flex;
        align-items: center;
        justify-content: center;

        .topicset__item__img {
          width: 192px;
          height: 192px;
        }
      }

      .topicset__item__right_box {
        width: 0;
        flex: 1;
        height: fit-content;
        min-height: 252px;
        padding: 32px 56px 0 48px;
        box-sizing: border-box;

        .topicset__item__title {
          width: 100%;
          height: fit-content;
          font-size: 28px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.9);
          line-height: 36px;
        }

        .topicset__item__knowledge {
          width: 100%;
          height: fit-content;
          font-size: 20px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.6);
          line-height: 28px;
          margin-top: 16px;
        }

        .topicset__item__btns {
          width: 100%;
          height: fit-content;
          display: flex;
          flex-wrap: wrap;
          margin-top: 32px;

          .topicset__item__btn {
            width: 240px;
            height: 48px;
            background: #ecf2fe;
            border-radius: 3px;
            border: 1px solid #266fe8;
            font-size: 16px;
            color: #266fe8;
            line-height: 24px;
            padding: 0;
            margin-bottom: 24px;

            &:not(:nth-child(5n)) {
              margin-right: 24px;
            }

            &.topicset__item__btn_blue {
              background: #e8f8f2;
              border-color: #078d5c;
              color: #078d5c;
            }
          }
        }
      }
    }
  }
}
</style>
