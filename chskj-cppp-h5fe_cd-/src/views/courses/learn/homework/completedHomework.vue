<!--
 * @Date: 2023-05-16 11:57:22
 * @LastEditTime: 2023-05-16 14:09:43
-->
<template>
  <div class="completedHomework_box">
    <homeworkSummary
      v-if="isShowSummary"
      :paperId="paperId"
      :tags="tags"
      class="homework_summary_box"
    ></homeworkSummary>
    <div v-else class="page_box">
      <div class="content_box" v-if="activeObj.questionType != '编程题'">
        <div class="question_box">
          <!-- 标题 -->
          <div class="topic_box">
            <p class="topic_title">
              {{ activeObj.preface }}、{{ nowQuestion.tblObjInfo.objText }}
            </p>
          </div>
          <!-- 题目图片 -->
          <template v-if="nowQuestion.tblObjInfo.myObjImage?.length">
            <a-image
              v-for="img in nowQuestion.tblObjInfo.myObjImage"
              class="question_img"
              :src="img"
            />
          </template>

          <!-- 代码片段 -->
          <div
            class="code"
            v-if="nowQuestion.tblObjInfo.objCode"
            v-html="
              (nowQuestion.tblObjInfo.objCode || '').replaceAll(/\n/g, '<br />')
            "
          ></div>
          <!-- 单选类型 -->
          <a-radio-group
            v-show="!nowQuestion.tblObjInfo.ifMultiple"
            class="option_box"
            v-model:value="nowQuestion.answer.answer"
            disabled
          >
            <a-radio
              class="option_item"
              v-for="(optionItem, optionIndex) in nowQuestion.tblObjInfo
                .objOption"
              :value="optionIndex"
              :class="{
                correct: nowQuestion.tblObjInfo.objAnswer == optionIndex,
                error:
                  nowQuestion.answer.answer == optionIndex &&
                  nowQuestion.tblObjInfo.objAnswer != nowQuestion.answer.answer,
              }"
            >
              <!-- optionIndex == nowQuestion.key ? 'active' : '' -->
              <div class="option_content">
                <div class="left">{{ optionIndex }}.</div>
                <div class="right">
                  <img
                    v-if="optionItem.image"
                    :src="optionItem.image"
                    class="option_img"
                  />
                  <p
                    v-html="(optionItem.text || '').replaceAll(/\n/g, '<br />')"
                  ></p>
                </div>
              </div>
            </a-radio>
          </a-radio-group>
          <!-- 多选类型 -->
          <a-checkbox-group
            v-if="nowQuestion.tblObjInfo.ifMultiple"
            class="option_box"
            v-model:value="nowQuestion.answer.answer"
            disabled
          >
            <a-checkbox
              class="option_item"
              v-for="(optionItem, optionIndex) in nowQuestion.tblObjInfo
                .objOption"
              :value="optionIndex"
              :class="{
                correct: nowQuestion.tblObjInfo.mAnswer.includes(optionIndex),
                error:
                  nowQuestion.answer.answer.includes(optionIndex) &&
                  !nowQuestion.tblObjInfo.mAnswer.includes(
                    nowQuestion.answer.answer
                  ),
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
                    v-html="(optionItem.text || '').replaceAll(/\n/g, '<br />')"
                  ></p>
                </div>
              </div>
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <div class="operate_box">
          <div class="operate_left">
            <span class="label">正确答案：</span>
            <span class="value">{{ nowQuestion.tblObjInfo.objAnswer }}</span>
          </div>
          <div class="operate_right">
            <a-button
              @click="changeStep(-1)"
              class="step_btn"
              :class="activeObj.preface == 1 ? 'disabled' : ''"
              :disabled="activeObj.preface == 1"
              >上一题</a-button
            >
            <a-button
              @click="changeStep(1)"
              class="step_btn"
              :disabled="activeObj.preface == totalQuestionNum"
              :class="activeObj.preface == totalQuestionNum ? 'disabled' : ''"
              >下一题</a-button
            >
          </div>
        </div>
      </div>
      <div
        class="python_content_box"
        v-if="activeObj.questionType == '编程题' && nowQuestion.tblProgramInfo"
      >
        <div class="topic_box">
          <p class="topic_title">
            {{ activeObj.preface }}、{{
              nowQuestion.tblProgramInfo?.langName
            }}编程题{{ String(activeObj.questionNum + 1).padStart(2, '0') }}
          </p>
          <!-- 题目描述 -->

          <pre
            class="describe text_margin"
            v-html="
              (nowQuestion.tblProgramInfo.questionDesc || '').replaceAll(
                /\n/g,
                '<br />'
              )
            "
          ></pre>
          <!-- 用例输入 -->
          <p class="describe">用例输入：</p>
          <pre
            class="describe text_margin"
            v-html="
              (nowQuestion.tblProgramInfo.inputSample || '').replaceAll(
                /\n/g,
                '<br />'
              )
            "
          ></pre>
          <!-- 用例输出 -->
          <p class="describe">用例输出：</p>
          <pre
            class="describe text_margin"
            v-html="
              (nowQuestion.tblProgramInfo.outputSample || '').replaceAll(
                /\n/g,
                '<br />'
              )
            "
          ></pre>
        </div>

        <div class="compiler_box">
          <div class="title_box">
            <img src="@/assets/course/in_exam.png" class="title_icon" />
            <span class="title_text">代码编辑器</span>
          </div>
          <Compiler
            class="compiler"
            ref="editorRef"
            :language="nowQuestion.tblProgramInfo?.langName"
            :value="nowQuestion.programCode"
            read-only
          />
          <div class="result_box">
            <div class="py_operate_box">
              <a-button
                @click="changeStep(-1)"
                class="step_btn"
                :class="activeObj.preface == 1 ? 'disabled' : ''"
                :disabled="activeObj.preface == 1"
                >上一题</a-button
              >
              <a-button
                @click="changeStep(1)"
                class="step_btn"
                :disabled="activeObj.preface == totalQuestionNum"
                :class="activeObj.preface == totalQuestionNum ? 'disabled' : ''"
                >{{ '下一题' }}</a-button
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="scratch_content_box"
        v-if="activeObj.questionType == '编程题' && nowQuestion.tblOperateInfo"
      >
        <div class="paper">
          <p class="title">
            {{ activeObj.preface }}、Scratch操作题
            {{ String(activeObj.questionNum + 1).padStart(2, '0') }}
          </p>
          <div class="text">
            编程要求：
            <br />
            <p
              v-html="
                (nowQuestion.tblOperateInfo.questionDesc || '').replaceAll(
                  /\n/g,
                  '<br />'
                )
              "
            ></p>
          </div>
          <!-- 题目图片 -->
          <template v-if="nowQuestion.mImage?.length">
            <a-image
              v-for="img in nowQuestion.mImage"
              class="question_img"
              :src="img"
            />
          </template>
        </div>
        <iframe
          class="card"
          :src="VUE_APP_SCRATCH_URL"
          ref="scratchRef"
          frameborder="0"
        ></iframe>
        <!-- http://192.168.1.9:8081/ -->
      </div>
      <div class="answer_time" v-if="activeObj.questionType != '编程题'">
        <span class="label">作答耗时</span>
        <span class="value" :class="nowQuestion.answerTime ? '' : 'unAnswer'">{{
          nowQuestion.answerTime ? `${nowQuestion.answerTime}秒` : '未作答'
        }}</span>
      </div>
      <div class="analysis_box">
        <div class="analysis_title">
          <div class="title_left">
            {{ activeObj.questionType == '编程题' ? '解题思路' : '答案解析' }}
          </div>
          <a-rate
            class="title_right"
            disabled
            :value="
              nowQuestion.tblOperateInfo?.difficult ||
              nowQuestion.tblObjInfo?.difficult ||
              nowQuestion.tblProgramInfo?.difficult
            "
          />
        </div>
        <pre
          class="analysis_content"
          v-html="
            (
              nowQuestion.tblOperateInfo?.questionAnalysis ||
              nowQuestion.tblProgramInfo?.questionHelp ||
              nowQuestion.tblObjInfo?.objHelp ||
              ''
            )
              .replaceAll(/\n/g, '<br />')
              .replaceAll('\\', '')
          "
        ></pre>
      </div>
    </div>
    <homeworkCard
      :paperList="paperList"
      :activeObj="activeObj"
      :cardType="'completedHomework'"
      :tags="tags"
      :isShowSummary="isShowSummary"
      @isShowSummary="changeIsShowSummary"
      v-if="isInit"
    ></homeworkCard>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  onMounted,
  computed,
  watch,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import homeworkSummary from './homeworkSummary.vue';
import homeworkCard from './homeworkCard.vue';
import { Compiler } from '@/components';

import { get, set } from '@vueuse/core';
import { useUserStore } from '@/store';
const { VUE_APP_SCRATCH_URL } = process.env;

const props = defineProps({ paperId: Number, tags: Array });
const isInit = ref(false);
const { proxy } = getCurrentInstance(),
  userStore = useUserStore();
const tags = ref([]);
const paperList = ref({});
const typeList = ref({});

const isShowSummary = ref(true);
const nowQuestion = computed(() => {
  if (!get(isInit)) return {};
  return get(paperList)[activeObj.questionType]?.children[
    activeObj.questionNum
  ];
});
const activeObj = reactive({
  questionType: '', // 当前选中类型
  questionTypeIndex: 0, // 当前选中类型索引
  questionNum: 0, // 当前选中类型索引
  preface: 0, // 当前答题卡选中题号
});
onMounted(() => {
  getAnswerCard();
});
onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage);
});

const handleMessage = async (e) => {
  if (e.data.constructor !== String) return;
  // console.log('vue接收到的数据======', JSON.parse(e.data));
  if (e.data) {
    const { type, data } = JSON.parse(e.data);
    switch (type) {
      case 'getInitType':
        postMessage({ type: 'getInitType', data: 'summary' });
        postMessage({ type: 'loadData', data: get(nowQuestion).scratchSave });
        break;
      case 'viewResolution':
        postMessage({
          type: 'loadData',
          data: get(nowQuestion).tblOperateInfo.sampleFile,
        });
        break;
      case 'recoveryAnswer':
        postMessage({
          type: 'loadData',
          data: get(nowQuestion).scratchSave,
        });
        break;
      case 'changeStep':
        changeStep(data);
        break;
    }
  }
};
watch(
  () => activeObj?.questionType,
  (data) => {
    if (get(nowQuestion).operateId && data == '编程题') {
      window.removeEventListener('message', handleMessage);
      window.addEventListener('message', handleMessage);
    }
  }
);
watch(
  () => activeObj.preface,
  (data) => {
    if (
      get(nowQuestion)?.operateId &&
      get(activeObj.questionType) == '编程题'
    ) {
      nextTick(() => {
        postMessage({ type: 'loadData', data: get(nowQuestion).scratchSave });
      });
    }
  }
);

const scratchRef = ref();

const postMessage = (message) => {
  const iframeWin = get(scratchRef)?.contentWindow;
  iframeWin?.postMessage({ ...message }, '*');
};

const totalQuestionNum = ref(0);
const getAnswerCard = async () => {
  let total = 0;
  const params = {
    stuId: userStore?.userInfo?.stuId,
    paperId: props.paperId,
  };
  const res = await proxy.$api.getAnswerCard(params);
  if (res.resultCode == 200) {
    const paper = {};
    let num = 1;
    Object.keys(res.data).forEach((typeItem) => {
      if (typeItem == '相关知识点') {
        set(tags, res.data[typeItem] || []);
      } else {
        const obj = {};
        obj.children = res.data[typeItem];
        let doneQuestion = 0;
        total += obj.children.length;
        obj.children.forEach((questionItem, questionIndex) => {
          questionItem.preface = num + questionIndex;
          if (!(typeItem == '编程题' || typeItem == '操作题')) {
            questionItem.tblObjInfo.objOption = JSON.parse(
              questionItem.tblObjInfo.objOption
            );
            questionItem.answer = JSON.parse(questionItem.answer);
            if (questionItem.answer?.answer) doneQuestion++;
            if (questionItem.tblObjInfo.ifMultiple) {
              questionItem.tblObjInfo.mAnswer =
                questionItem.tblObjInfo.objAnswer.split(',');
              questionItem.answer.answer = questionItem.answer.answer || [];
            }
            if (questionItem.tblObjInfo.objImage) {
              questionItem.tblObjInfo.myObjImage =
                JSON.parse(questionItem.tblObjInfo.objImage) || [];
            }
          } else {
            if (questionItem.programCode) doneQuestion++;
            if (questionItem.tblOperateInfo?.questionImage) {
              questionItem.mImage =
                JSON.parse(questionItem.tblOperateInfo?.questionImage) || [];
            }
            questionItem.key = '';
          }
        });
        obj.isComplete = obj.children.length == doneQuestion;
        obj.doneQuestion = doneQuestion;
        obj.isExpand = false;
        num += obj.children.length;
        if (typeItem == '操作题') {
          paper.编程题 = obj;
        } else {
          paper[typeItem] = obj;
        }
      }
      set(paperList, paper);
      set(typeList, Object.keys(get(paperList)));
      set(isInit, true);
    });
    set(totalQuestionNum, total);
  }
};

const changeIsShowSummary = (data) => {
  set(isShowSummary, data);
  if (data) {
    Object.keys(get(paperList)).forEach((item) => {
      get(paperList)[item].isExpand = false;
    });
  }
};
// 恢复试卷置顶
const resetPosition = (id) => {
  const content = document.querySelector(id);
  content.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};
// 点击切换上下题
const changeStep = (val) => {
  if (
    activeObj.preface + val > get(totalQuestionNum) ||
    activeObj.preface + val == 0
  ) {
    return;
  }
  const nowTypeNum = get(paperList)[activeObj.questionType].children.length - 1;
  if (
    (activeObj.questionNum == 0 && val == -1) ||
    (activeObj.questionNum == nowTypeNum && val == 1)
  ) {
    activeObj.questionTypeIndex = activeObj.questionTypeIndex + val;
    activeObj.questionType = get(typeList)[activeObj.questionTypeIndex];
    activeObj.questionNum =
      val == 1 ? 0 : get(paperList)[activeObj.questionType].children.length - 1;
    get(paperList)[activeObj.questionType].isExpand = true;
  } else {
    activeObj.questionNum = activeObj.questionNum + val;
  }
  activeObj.preface = activeObj.preface + val;
  resetPosition('.page_box');
};
</script>

<style lang="less" scoped>
.completedHomework_box {
  display: flex;
  justify-content: space-between;
  background: #f3f3f3;
}
.homework_summary_box {
  flex: 1;
  background: #ffffff;
  height: calc(100vh - 120px);
  overflow: auto;
}
.page_box {
  padding-bottom: 24px;
  // width: 944px;
  flex: 1;
  height: calc(100vh - 120px);
  background: #ffffff;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  :deep(.ant-image) {
    .question_img {
      margin: 16px 8px 16px 0;
      width: 200px;
      height: 200px;
    }
  }
  .content_box {
    padding: 15px 16px;
    .question_box {
      .code {
        margin-bottom: 16px;
        font-size: 14px;
        padding: 32px 48px;
        background: #f7f6f3;
      }
      .topic_box {
        margin-bottom: 16px;
        .topic_title {
          font-size: 20px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.9);
          line-height: 48px;
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

        .error {
          border: 1px solid #f6685d;
          background: #fff0ed;
          color: #d54941;
          :deep(.ant-radio-inner) {
            &::after {
              background-color: #d54941;
            }
          }
          :deep(.ant-checkbox-inner) {
            background-color: #d54941;
            &::after {
              border-color: rgba(255, 255, 255.5);
            }
          }
          .option_content {
            color: #d54941;
          }
        }
        .correct {
          background: #e3f9e9;
          border: 1px solid #56c08d;
          color: #2ba471;
          :deep(.ant-radio-inner) {
            &::after {
              background-color: #2ba471;
            }
          }
          :deep(.ant-checkbox-inner) {
            background-color: #2ba471;
          }

          .option_content {
            color: #2ba471;
          }
        }
        .type-half {
          width: 560px;
        }
      }
    }
    .operate_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .operate_left {
        .label {
          margin-right: 16px;
          font-size: 20px;
          font-weight: 600;
          color: #00a870;
          line-height: 40px;
        }
        .value {
          font-size: 20px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.9);
          line-height: 40px;
        }
      }
      .operate_right {
        .step_btn,
        .disabled,
        .check_btn,
        .submit_btn {
          width: 144px;
          height: 40px;
          font-size: 16px;
          border-radius: 3px;
        }
        .step_btn {
          margin-right: 16px;
          background: #ffffff;
          border: 1px solid #dcdcdc;
          color: rgba(0, 0, 0, 0.9);
        }
        .disabled {
          background: #eeeeee;
          border: 1px solid #dcdcdc;
          color: rgba(0, 0, 0, 0.26);
        }
        .check_btn {
          margin-right: 16px;
          background: #ffffff;
          color: #0052d9;
          border: 1px solid #0052d9;
        }
        .submit_btn {
          background: #0052d9;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }
  }
  .python_content_box {
    padding: 15px 16px;
    .topic_box {
      .topic_title {
        margin-bottom: 16px;
        font-size: 20px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        line-height: 48px;
      }
      .text_margin {
        margin-bottom: 24px;
      }
      .describe {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 28px;
      }
    }
    .title_box {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .title_icon {
        margin-right: 8px;
        width: 28px;
      }
      .title_text {
        font-size: 16px;
        font-weight: 600;
        color: #3d3d3d;
      }
    }
    .compiler_box {
      margin-bottom: 26px;
      .compiler {
        height: 320px;
      }
    }
    .input_box {
      margin-bottom: 24px;
    }
    .result_box {
      .result {
        padding: 5px 8px;
        min-height: 30px;
        background: #282c34;
        border: 1px solid #dcdcdc;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 22px;
      }
      .run_data {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 28px;
      }
      .py_operate_box {
        margin-top: 24px;
        display: flex;
        .runCode_btn,
        .step_btn,
        .disabled,
        .check_btn,
        .subCode_btn {
          padding: 5px 16px;
          display: flex;
          align-items: center;
          font-size: 14px;
          border-radius: 3px;
          line-height: 22px;
        }
        .subCode_btn {
          margin-right: 16px;
          background: #0052d9;
          color: rgba(255, 255, 255, 0.9);
        }
        .runCode_btn {
          margin-right: 16px;
          background: #f2f3ff;
          border: 1px solid #0052d9;
          .btn_text {
            margin-left: 9px;
            font-size: 14px;
            color: #0052d9;
          }
        }
        .step_btn {
          margin-right: 16px;
          background: #ffffff;
          border: 1px solid #dcdcdc;
          color: rgba(0, 0, 0, 0.9);
        }
        .disabled {
          background: #eeeeee;
          border: 1px solid #dcdcdc;
          color: rgba(0, 0, 0, 0.26);
        }
        .check_btn {
          margin-right: 16px;
          background: #ffffff;
          color: #0052d9;
          border: 1px solid #0052d9;
        }
      }
    }
  }
  .scratch_content_box {
    background: #ffffff;
    padding: 16px;
    &::-webkit-scrollbar {
      // width: 0;
      // height: 0;
    }
    .paper {
      .title {
        font-size: 28px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        line-height: 56px;
      }
      .text {
        margin: 16px 0 24px 0;
        font-size: 24px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        line-height: 48px;
      }
      .img {
        max-width: 100%;
      }
    }
    .card {
      width: 100%;
      height: 801px;
      background: #fff;
      margin-bottom: 16px;
      background: url('@/assets/learn/scratch.jpg') no-repeat center;
      background-size: cover;
    }
  }
  .answer_time {
    padding: 0 16px;
    display: flex;
    .label {
      margin-right: 35px;
      font-size: 20px;
      font-weight: 600;
      color: #242424;
      line-height: 40px;
    }
    .value {
      font-size: 20px;
      color: #3d3d3d;
      line-height: 40px;
    }
    .unAnswer {
      color: #be5a00;
    }
  }
  .analysis_box {
    padding: 0 16px;
    .analysis_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 24px 0 16px 0;
      font-size: 20px;
      font-weight: 600;
      color: #242424;
      line-height: 40px;
    }
    :deep(.analysis_content) {
      padding: 16px 24px;
      background: #f9f9f9;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 28px;
      img {
        max-width: 100%;
      }
    }
  }
}
</style>
