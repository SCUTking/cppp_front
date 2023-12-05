<template>
  <!-- 提示栏 -->
  <div class="tips_box">
    <div class="left_box">
      <img src="@/assets/course/error.png" class="left_icon" />
      <span class="text">
        本次单元测试只能提交一次，且提交后不能再修改；提交客观题后将进入主观题作答。
      </span>
    </div>
    <div class="right_box">
      <div class="item_box">
        <img src="@/assets/course/icon1.png" class="item_icon" />
        <span class="text" style="color: #e37318"
          >未做：{{ unsettledQuestion }} 题</span
        >
      </div>
      <div class="item_box">
        <img src="@/assets/course/icon2.png" class="item_icon" />
        <span class="text" style="color: #0052d9"
          >已做：{{ doneQuestion }} 题</span
        >
      </div>
    </div>
    <div class="countdown_box">
      <img src="@/assets/course/Clock.png" class="countdown_icon" />
      <span class="text">剩余时间</span>
      <a-statistic-countdown
        class="time"
        :value="deadline"
        @finish="onFinish"
      />
    </div>
  </div>
  <!-- 试卷内容 -->
  <div class="content_box">
    <div class="paper">
      <div class="content" id="content">
        <div class="type_box" v-for="(item, index) in list">
          <p class="type_title">{{ figureMap[index] + '、' + item.name }}</p>
          <div
            :id="'elm' + questionItem.objId"
            class="question_box"
            v-for="(questionItem, questionIndex) in item.children"
          >
            <!-- 标题 -->
            <div class="topic_box">
              <div class="topic_top">
                <p class="topic_title">
                  {{ questionIndex + item.num }}、{{ questionItem.objText }}
                </p>
              </div>
            </div>
            <!-- 题目图片 -->
            <template v-if="questionItem.myObjImage?.length">
              <a-image
                v-for="img in questionItem.myObjImage"
                class="question_img"
                :src="img"
              />
            </template>
            <!-- 代码片段 -->
            <div
              class="code"
              v-if="questionItem.objCode"
              v-html="(questionItem.objCode || '').replaceAll(/\n/g, '<br />')"
            ></div>
            <!-- 单选类型 -->
            <a-radio-group
              v-show="!questionItem.ifMultiple"
              class="option_box"
              v-model:value="questionItem.key"
              :disabled="questionItem.isSubmit"
              @change="cmpQuestion"
            >
              <a-radio
                class="option_item"
                v-for="(optionItem, optionIndex) in questionItem.objOption"
                :value="optionIndex"
                :class="{
                  active:
                    !questionItem.isSubmit && optionIndex == questionItem.key,
                }"
              >
                <div class="option_content">
                  <div class="left">{{ optionIndex }}.</div>
                  <div class="right">
                    <img
                      v-if="optionItem.image"
                      :src="optionItem.image"
                      class="option_img"
                    />
                    <p
                      v-html="
                        (optionItem.text || '').replaceAll(/\n/g, '<br />')
                      "
                    ></p>
                  </div>
                </div>
              </a-radio>
            </a-radio-group>
            <!-- 多选类型 -->
            <a-checkbox-group
              v-if="questionItem.ifMultiple"
              class="option_box"
              v-model:value="questionItem.key"
              :disabled="questionItem.isSubmit"
              @change="cmpQuestion"
            >
              <a-checkbox
                class="option_item"
                v-for="(optionItem, optionIndex) in questionItem.objOption"
                :value="optionIndex"
                :class="{
                  active:
                    !questionItem.isSubmit &&
                    questionItem.key.includes(optionIndex),
                }"
              >
                <div class="option_content">
                  <div class="left">{{ optionIndex }}.</div>
                  <div class="right">
                    <img
                      v-if="optionItem.image"
                      :src="optionItem.image"
                      class="option_img"
                    />

                    <p
                      v-html="
                        (optionItem.text || '').replaceAll(/\n/g, '<br />')
                      "
                    ></p>
                  </div>
                </div>
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="content">
        <div class="title">
          <div class="title_left">
            <img src="@/assets/course/in_unit.png" class="title_icon" />
            <span class="title_text">答题卡（客观题）</span>
          </div>
          <div class="title_right">共 {{ allQuestion }} 题</div>
        </div>
        <div class="card_box-scroll">
          <div class="card_box">
            <div class="card_items" v-for="(item, index) in list">
              <p class="card_items_title">{{ item.name }}</p>
              <div class="card_item_group">
                <div
                  class="card_item"
                  v-for="(questionItem, questionIndex) in item.children"
                  :class="{
                    finish:
                      (!questionItem.ifMultiple && questionItem.key) ||
                      (questionItem.ifMultiple && questionItem.key.length > 0),
                  }"
                  @click="positioningTopic(questionItem.objId)"
                >
                  {{ questionIndex + item.num }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn_box">
        <a-button @click="showSubmitModal" class="submit_btn"
          >提交客观题</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref, watch } from 'vue';
import { get, set } from '@vueuse/core';

const { proxy } = getCurrentInstance();
const props = defineProps({
  list: { type: Array },
  deadline: { type: Number },
});

const list = ref(props.list);
const unsettledQuestion = ref(0); // 试卷未做题数
const doneQuestion = ref(0); // 试卷已做题数
const allQuestion = ref(0); // 试卷总题数
const emit = defineEmits(['showSubmitModal', 'submit']);
// 静态资源拼接php域名（前面加mb）
const figureMap = {
  // 大题序号字典
  0: '一',
  1: '二',
  2: '三',
  3: '四',
};

// 初始话试题提示数
const initPaper = () => {
  cmpAllQuestion();
  cmpQuestion();
};
// 计算总题数
const cmpAllQuestion = () => {
  let allNums = 0;
  get(list).forEach((typeItem) => {
    allNums += typeItem.children.length;
  });
  set(allQuestion, allNums);
};
// 计算已做/未做题目数
const cmpQuestion = () => {
  let doneNums = 0;
  get(list).forEach((typeItem) => {
    typeItem.children.forEach((questionItem) => {
      if (!questionItem.ifMultiple && questionItem.key) doneNums++;
      if (questionItem.ifMultiple && questionItem.key.length > 0) doneNums++;
    });
  });
  set(doneQuestion, doneNums);
  set(unsettledQuestion, get(allQuestion) - doneNums);
};
onMounted(() => {
  initPaper();
});

// 定位题目
const positioningTopic = (id) => {
  const content = document.querySelector('.paper');
  const elm = content.querySelector('#elm' + id);
  const top = elm.offsetTop - (window.innerWidth / 1920) * 120;
  content.scrollTo({
    top,
    left: 0,
    behavior: 'smooth',
  });
};

// 交卷
const showSubmitModal = () => {
  emit('showSubmitModal');
};
// 倒计时结束交卷
const onFinish = () => {
  // emit('submit');
};
</script>

<style lang="less" scoped>
.tips_box {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0 156px 0 28px;
  width: 100vw;
  height: 56px;
  background: #f9f6d0;
  .left_box {
    display: flex;
    align-items: center;
    .tips {
      display: flex;
      align-items: center;
    }
    .left_icon {
      margin-right: 8px;
      width: 28px;
    }
  }
  .right_box {
    display: flex;
    align-items: center;
    .item_box {
      display: flex;
      align-items: center;
      margin-left: 24px;
    }
    .item_icon {
      width: 28px;
    }
  }
  .text {
    font-size: 16px;
    line-height: 32px;
  }
  .countdown_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    padding: 3px 24px 3px 16px;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 100px;
    opacity: 1;
    border: 1px solid rgba(0, 0, 0, 0.26);

    .countdown_icon {
      width: 28px;
    }
    .text {
      margin: 0 8px;
      font-size: 20px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
      line-height: 32px;
    }
    :deep(.time) span {
      color: #c9353f;
      font-weight: 600;
      font-family: unset;
      font-size: 0.125rem;
      line-height: 0.16667rem;
    }
    .ant-statistic-content {
      line-height: 32px;
    }
  }
}
.content_box {
  display: flex;
  .paper {
    width: 1520px;
    height: calc(100vh - 120px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
    }
    .content {
      padding: 0 32px 150px 32px;
      background: #ffffff;
      min-height: calc(100vh - 120px);
      .type_box {
        .type_title {
          padding: 24px 0 0 32px;
          font-size: 28px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.9);
          line-height: 56px;
        }
        .question_box {
          padding: 32px 32px 16px 32px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          .code {
            margin-bottom: 16px;
            font-size: 14px;
            padding: 32px 48px;
            background: #f7f6f3;
          }
          .topic_box {
            .topic_top {
              display: flex;
              justify-content: space-between;
              margin-bottom: 16px;
            }
            .topic_title {
              margin-right: 24px;
              font-size: 24px;
              font-weight: 600;
              color: rgba(0, 0, 0, 0.9);
              line-height: 48px;
            }
          }
          :deep(.ant-image) {
            .question_img {
              margin: 16px 8px 16px 0;
              width: 200px;
              height: 200px;
            }
          }
          .option_box {
            display: flex;
            flex-wrap: wrap;
            // justify-content: space-between;
            width: 100%;
            .option_item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              margin-left: 0;
              padding: 14px 16px;
              width: 100%;
              border: 1px solid #f3f3f3;
              border-radius: 8px;
              :deep(.ant-radio) {
                transform: translateY(-15%);
              }

              .option_content {
                display: flex;
                font-size: 20px;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.9);
                line-height: 28px;
                .left {
                  display: flex;
                  align-items: center;
                  margin-right: 8px;
                }
                .option_img {
                  margin-bottom: 8px;
                  max-width: 100%;
                }
              }
              :deep(.ant-checkbox) {
                transform: translateY(-3px);
              }
            }
            .inactive {
              :deep(.ant-radio-inner) {
                &::after {
                  background-color: #2d00a8;
                  transform: scale(0.5);
                  opacity: 1;
                }
              }
            }
            .active {
              background: #ecf2fe;
              border: 1px solid #699ef5;
              color: #0052d9;
              :deep(.ant-radio-inner) {
                &::after {
                  background-color: #0052d9;
                }
              }
              :deep(.ant-checkbox-inner) {
                background-color: #0052d9;
              }
              .option_content {
                color: #0052d9;
              }
            }
          }
        }
      }
    }
  }
  .card {
    width: 400px;
    height: calc(100vh - 120px);
    background: #f3f3f3;
    position: relative;

    .content {
      padding: 16px;
      // margin-bottom: 130px;
      min-height: calc(100vh - 120px);
      position: relative;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        padding: 10px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);

        .title_left {
          display: flex;
          align-items: center;
          .title_icon {
            margin-right: 8px;
            width: 28px;
          }
          .title_text {
            font-size: 16px;
            font-weight: 600;
            line-height: 28px;
          }
        }
        .title_right {
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.6);
          line-height: 28px;
        }
      }
      .card_box-scroll {
        height: calc(100vh - 340px);
        // background: red;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          width: 0;
        }
      }
      .card_items_title {
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.6);
        line-height: 24px;
      }
      .card_item_group {
        display: flex;
        flex-wrap: wrap;
        padding-top: 24px;
        .card_item {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 22px 24px 0;
          position: relative;
          width: 56px;
          height: 56px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.25);
          font-size: 20px;
          font-weight: 600;
          color: #000;
          cursor: pointer;
          &:nth-of-type(5n) {
            margin-right: 0;
          }
        }
        .active {
        }
        .finish {
          background: #ecf2fe;
          border: 1px solid #699ef5;
          color: #0052d9;
        }
      }
    }
    .btn_box {
      position: absolute;
      bottom: 0;
      background: rgba(255, 255, 255, 0.55);
      height: 96px;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      box-sizing: content-box;
      .submit_btn {
        margin: 16px 24px;
        width: 320px;
        height: 64px;

        background: #2ba471;
        border-radius: 32px;
        font-size: 28px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);

        box-shadow: 0px 4px 0px 0px #008858;
        border: unset;
      }
    }
  }
}
</style>
