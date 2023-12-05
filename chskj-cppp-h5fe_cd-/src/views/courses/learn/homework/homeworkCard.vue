<template>
  <div class="card_box" v-show="showCard">
    <div class="card_title">
      <div class="left">
        <AppstoreOutlined class="title_icon" />
        <span class="title_text">作业</span>
      </div>
      <img
        class="right"
        @click="changeShowCard(false)"
        src="@/assets/learn/Light.png"
      />
    </div>
    <div class="card_content">
      <div class="card_title2">知识点（{{ tags.length }}）</div>
      <Tags class="tags" :tags="tags" label="knowledge" id="ckId" />
      <span class="card_title2">作业题型</span>
      <p class="card_title3" v-if="cardType == 'completedHomework'">
        请点击展开答题卡查看具体答题情况
      </p>
      <div class="card_main">
        <div class="card" v-for="(item, key) in paperList" :key="key">
          <div
            class="card_top"
            :class="{
              complete: item.isComplete && cardType != 'completedHomework',
            }"
            :id="
              activeObj.questionType == key &&
              (cardType != 'completedHomework' || !isShowSummary)
                ? 'active'
                : ''
            "
            @click="changeExpand(key)"
          >
            <div class="card_left">
              {{ `${key} (${item.doneQuestion}/${item.children.length})` }}
            </div>
            <div class="card_right">
              <span
                :class="{
                  card_text: true,
                  isComplete:
                    item.isComplete && cardType == 'completedHomework',
                  completedHomeworkText: cardType == 'completedHomework',
                }"
                >{{ item.isComplete ? '已完成' : '待完成' }}</span
              >
              <right-outlined
                class="card_icon"
                :rotate="item.isExpand == 1 ? -90 : 90"
              />
            </div>
          </div>
          <div class="obj_boxs" v-show="item.isExpand">
            <div
              :class="{
                obj_item: true,
                submit: cardType != 'completedHomework' && isSubmit,
                correct: objItem.isRight && cardType == 'completedHomework',
                error: !objItem.isRight && cardType == 'completedHomework',
                incomplete:
                  !(objItem.answer?.answer || objItem.programCode) &&
                  cardType == 'completedHomework',
              }"
              :id="
                activeObj.preface == objItem.preface &&
                (cardType != 'completedHomework' || !isShowSummary)
                  ? 'active'
                  : ''
              "
              v-for="(objItem, objIndex) in item.children"
              @click="changeQuestionNum(key, objItem.preface, objIndex)"
            >
              {{ objItem.preface }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="card_bottom"
      v-if="cardType != 'completedHomework' || !isShowSummary"
    >
      <a-button
        v-if="cardType != 'completedHomework'"
        class="card_button"
        @click="submitPaper"
        >提交作业</a-button
      >
      <a-button
        class="card_button"
        v-else-if="!isShowSummary"
        @click="changeShowSummary"
        >返回总结概况</a-button
      >
    </div>
  </div>
  <div class="card_box2" v-show="!showCard">
    <div class="card_main" @click="changeShowCard(true)">
      <div class="icon_box">
        <AppstoreOutlined class="icon" />
      </div>
      <p class="text1">作业</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted, nextTick } from 'vue';
import { AppstoreOutlined } from '@ant-design/icons-vue';
import { get, set, toReactive } from '@vueuse/core';
import { Tags } from '@/components';
const props = defineProps({
  paperList: Object,
  activeObj: Object,
  cardType: String,
  tags: Array,
  isShowSummary: Boolean,
});

const activeObj = toReactive(props.activeObj);
const paperList = toReactive(props.paperList);

const { proxy } = getCurrentInstance();
const showCard = ref(true);
const changeExpand = (key) => {
  paperList[key].isExpand = !paperList[key].isExpand;
};
// 点击答题卡切换题目
const changeQuestionNum = (key, preface, questionNum) => {
  activeObj.questionType = key;
  activeObj.preface = preface;
  activeObj.questionNum = questionNum;
  activeObj.questionTypeIndex = Object.keys(get(paperList)).findIndex(
    (item) => item == key
  );
  emit('isShowSummary', false);
  nextTick(() => {});
  resetPosition('.page_box');
};
// 返回总结感慨
const changeShowSummary = () => {
  emit('isShowSummary', true);
};
// 恢复试卷置顶
const resetPosition = (id) => {
  const content = document.querySelector(id);
  if (content) {
    content.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
};

const emit = defineEmits(['submitPaper', 'isShowSummary']);

const changeShowCard = (val) => {
  set(showCard, val);
};

const submitPaper = () => {
  emit('submitPaper');
};
</script>

<style lang="less" scoped>
.card_box {
  position: relative;
  padding: 15px;
  width: 400px;
  height: calc(100vh - 120px);
  .card_title {
    padding: 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
    .left {
      display: flex;
      align-items: center;
      .title_icon {
        color: rgba(0, 0, 0, 0.9);

        margin-right: 8px;
        font-size: 28px;
      }
      .title_text {
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        line-height: 28px;
      }
    }
    .right {
      cursor: pointer;
      width: 32px;
    }
  }
  .card_content {
    height: calc(100% - 130px);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
    .card_title2 {
      margin: 16px 0 8px 0;
      height: 44px;
      font-size: 16px;
      font-weight: 600;
      color: #3d3d3d;
      line-height: 44px;
    }
    .card_title3 {
      margin-bottom: 16px;
      padding-left: 20px;
      height: 44px;
      line-height: 44px;
      background: #f9f6d0;
      border-radius: 6px;
      border: 1px solid rgba(139, 87, 42, 0.149);
      font-size: 14px;
      color: #8b572a;
    }
    .tags {
      padding-bottom: 24px;
    }
    .card_main {
      .card {
        .card_top {
          padding: 8px 16px 8px 24px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 44px;
          border-radius: 22px;
          border: 1px solid rgba(0, 0, 0, 0.26);
          cursor: pointer;

          &:hover {
            background: #f2f3ff;
            border: 1px solid #366ef4;
            .card_left {
              color: #0052d9;
            }
            .card_right {
              .card_text,
              .card_icon {
                color: #0052d9;
              }
            }
          }
          .card_left {
            font-size: 14px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
          }
          .card_right {
            display: flex;
            align-items: center;
            .card_text {
              font-size: 14px;
              color: rgba(0, 0, 0, 0.6);
            }
            .completedHomeworkText {
              color: #be5a00;
            }
            .isComplete {
              color: #008858;
            }
            .card_icon {
              margin-left: 8px;
              color: rgba(0, 0, 0, 0.6);
            }
          }
        }
        #active {
          background: #366ef4;
          border: 1px solid #366ef4;

          .card_left {
            color: rgba(255, 255, 255, 0.9);
          }
          .card_right {
            .card_text,
            .card_icon {
              color: rgba(255, 255, 255, 0.9);
            }
          }
        }
        .complete {
          background: #e3f9e9;
          border: 1px solid #e3f9e9;
          .card_left {
            color: #008858;
          }
          .card_right {
            .card_text,
            .card_icon {
              color: #008858;
            }
          }
        }
        .obj_boxs {
          padding: 0 20px;
          display: flex;
          flex-wrap: wrap;
          .obj_item {
            cursor: pointer;
            margin-bottom: 16px;
            margin: 0 32px 16px 0;
            text-align: center;
            width: 40px;
            height: 40px;
            background: #ffffff;
            border-radius: 8px 8px 8px 8px;
            opacity: 1;
            border: 1px solid rgba(0, 0, 0, 0.26);
            font-size: 18px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
            line-height: 38px;
            &:nth-of-type(5n) {
              margin-right: 0;
            }
          }
          .submit {
            color: #0052d9;
            background: #f2f3ff;
            border: 1px solid #366ef4;
          }
          .correct {
            color: rgba(255, 255, 255, 0.9);
            background: #2ba471;
          }
          .error {
            background: #d54941;
            color: rgba(255, 255, 255, 0.9);
          }

          .incomplete {
            background: #fff1e9;
            border: 1px solid #fa9550;
            color: #e37318;
          }
          #active {
            background: #366ef4;
            border: 1px solid #366ef4;
            color: rgba(255, 255, 255, 0.9);
          }
        }
      }
    }
  }
  .card_bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 96px;
    background: rgba(255, 255, 255, 0.55);
    border-top: 1px solid #ffffff;
    position: absolute;
    bottom: 0;
    left: 0;
    .card_button {
      width: 320px;
      height: 64px;
      background: #2ba471;
      box-shadow: 0px 4px 0px 0px #008858;
      border-radius: 100px;
      font-size: 28px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      border: unset;
    }
  }
}
.card_box2 {
  margin-top: 8px;
  display: flex;
  justify-content: center;
  width: 64px;
  .card_main {
    cursor: pointer;
    height: fit-content;
  }
  .icon_box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: #d9e1ff;
    border-radius: 50%;
    color: #366ef4;
    .icon {
      font-size: 28px;
    }
  }
  .text1 {
    margin-top: 4px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #366ef4;
    line-height: 22px;
  }
}
</style>
