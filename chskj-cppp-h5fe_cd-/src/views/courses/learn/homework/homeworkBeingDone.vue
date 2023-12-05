<template>
  <div class="homeworkBeingDone_box">
    <div class="page_box">
      <div class="content_box" v-show="activeObj.questionType != '编程题'">
        <div class="question_box">
          <!-- 标题 -->
          <div class="topic_box">
            <p class="topic_title">
              {{ activeObj.preface }}、{{ nowQuestion.objText }}
            </p>
          </div>
          <!-- 题目图片 -->
          <template v-if="nowQuestion.myObjImage?.length">
            <a-image
              v-for="img in nowQuestion.myObjImage"
              class="question_img"
              :src="img"
            />
          </template>

          <!-- 代码片段 -->
          <div
            class="code"
            v-if="nowQuestion.objCode"
            v-html="(nowQuestion.objCode || '').replaceAll(/\n/g, '<br />')"
          ></div>
          <!-- 单选类型 -->
          <a-radio-group
            v-show="!nowQuestion.ifMultiple"
            class="option_box"
            v-model:value="nowQuestion.key"
            :disabled="nowQuestion.isSubmit"
          >
            <a-radio
              class="option_item"
              v-for="(optionItem, optionIndex) in nowQuestion.objOption"
              :value="optionIndex"
              :class="{
                active: !nowQuestion.isSubmit && optionIndex == nowQuestion.key,
                correct:
                  nowQuestion.isSubmit && nowQuestion.objAnswer == optionIndex,
                error:
                  nowQuestion.isSubmit &&
                  nowQuestion.key == optionIndex &&
                  nowQuestion.objAnswer != nowQuestion.key,
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
            v-if="nowQuestion.ifMultiple"
            class="option_box"
            v-model:value="nowQuestion.key"
            :disabled="nowQuestion.isSubmit"
          >
            <a-checkbox
              class="option_item"
              v-for="(optionItem, optionIndex) in nowQuestion.objOption"
              :value="optionIndex"
              :class="{
                active:
                  !nowQuestion.isSubmit &&
                  nowQuestion.key.includes(optionIndex),
                correct:
                  nowQuestion.isSubmit &&
                  nowQuestion.objAnswerArr.includes(optionIndex),
                error:
                  nowQuestion.isSubmit &&
                  nowQuestion.key.includes(optionIndex) &&
                  !nowQuestion.objAnswerArr.includes(nowQuestion.key),
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
            <template v-if="nowQuestion.isThinking">
              <span class="label">正确答案：</span>
              <span class="value">{{ nowQuestion.objAnswer }}</span>
            </template>
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
            <a-button @click="toSubmitItem" class="check_btn"
              >查看解析</a-button
            >
            <a-button @click="toSubmitItem" class="submit_btn"
              >提交答案</a-button
            >
          </div>
        </div>
      </div>
      <div
        class="python_content_box"
        v-if="
          activeObj.questionType == '编程题' &&
          props.course_chapter_content.langName != 'scratch'
        "
      >
        <div class="topic_box">
          <p class="topic_title">
            {{ activeObj.preface }}、{{ nowQuestion.langName }}编程题{{
              String(activeObj.questionNum + 1).padStart(2, '0')
            }}
          </p>
          <!-- 题目描述 -->
          <pre
            class="describe text_margin"
            v-html="
              (nowQuestion.questionDesc || '').replaceAll(/\n/g, '<br />')
            "
          ></pre>
          <!-- 用例输入 -->
          <p class="describe">用例输入：</p>
          <pre
            class="describe text_margin"
            v-html="
              (nowQuestion.samples[0].inputSample || '').replaceAll(
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
              (nowQuestion.samples[0].outputSample || '').replaceAll(
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
            :language="nowQuestion.langName"
            :value="nowQuestion.key"
          />
        </div>

        <div class="input_box">
          <div class="title_box">
            <img src="@/assets/course/in_exam.png" class="title_icon" />
            <span class="title_text">用例输入</span>
          </div>
          <a-textarea class="input_box" v-model:value="inputValue" :rows="4" />
        </div>

        <div class="result_box">
          <div class="title_box">
            <img src="@/assets/course/in_unit.png" class="title_icon" />
            <span class="title_text">运行结果</span>
          </div>
          <!-- 运行结果 -->
          <pre
            class="result"
            v-html="(outputValue || '').replaceAll(/\n/g, '<br />')"
          ></pre>
          <p class="run_data">
            <!-- 本次编译运行总时间为865.46ms，共耗费内存为315.52MB,其中编译运行最长时间为95.62ms，耗费内存为31.76MB。 -->
          </p>
          <div class="py_operate_box">
            <a-button @click="runCode" class="runCode_btn">
              <template #icon><img src="@/assets/learn/code.png" /></template>
              <span class="btn_text">运行代码</span>
            </a-button>
            <a-button @click="subCode" class="subCode_btn">提交代码</a-button>
            <a-button @click="toThinkingItem" class="check_btn"
              >查看思路</a-button
            >
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
      <div
        class="scratch_content_box"
        v-if="
          activeObj.questionType == '编程题' &&
          props.course_chapter_content.langName == 'scratch'
        "
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
                (nowQuestion.questionDesc || '').replaceAll(/\n/g, '<br />')
              "
            ></p>
          </div>
          <!-- <img
            v-for="(item, index) in list[compileIndex]?.imgArr"
            :src="m_baseURL + item"
            class="img"
          /> -->
        </div>
        <iframe
          class="card"
          :src="VUE_APP_SCRATCH_URL"
          ref="scratchRef2"
          frameborder="0"
        ></iframe>
        <!-- http://192.168.1.9:8081/ -->
      </div>
      <div class="analysis_box" v-if="nowQuestion.isThinking">
        <div class="analysis_title">
          <div class="title_left">
            {{ activeObj.questionType == '编程题' ? '解题思路' : '答案解析' }}
          </div>
          <a-rate
            v-if="activeObj.questionType == '编程题'"
            class="title_right"
            disabled
            v-model:value="nowQuestion.difficult"
          />
        </div>
        <pre
          class="analysis_content"
          v-html="
            (
              nowQuestion.questionHelp ||
              nowQuestion.compileHelp ||
              nowQuestion.objHelp ||
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
      :cardType="'homeworkBeingDone'"
      :tags="tags"
      @submitPaper="submitPaper"
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
  onBeforeUnmount,
  computed,
  watch,
  nextTick,
} from 'vue';
import { RightOutlined, AppstoreOutlined } from '@ant-design/icons-vue';
import { get, set } from '@vueuse/core';
import { Compiler } from '@/components';
import { useRoute } from 'vue-router';
import homeworkCard from './homeworkCard.vue';
import { useCommonStore, useUserStore } from '@/store';
import { handleCompile, getCompileAnswer } from '@/utils';
import dayjs from 'dayjs';
const { VUE_APP_SCRATCH_URL } = process.env;

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  router = useRoute();
const props = defineProps({
  paperId: Number,
  course_chapter_content: Object,
  tags: Array,
});
const paperId = ref(0);
const isInit = ref(false);
const examBeginTime = ref(null);

const activeObj = reactive({
  questionType: '', // 当前选中类型
  questionTypeIndex: 0, // 当前选中类型索引
  questionNum: 0, // 当前选中类型索引
  preface: 0, // 当前答题卡选中题号
});
// 获取试卷做题记录
const getPaperRecords = () => {
  return new Promise(async (resolve) => {
    const params = {
      stuId: userStore?.userInfo?.stuId,
      paperId: get(paperId),
    };
    const res = await proxy.$api.getPaperRecords(params);
    resolve(res.data?.paperList || {});
  });
};
// 保存试卷做题记录（非提交）
const savePaperRecords = async () => {
  const params = {
    stuId: userStore?.userInfo?.stuId,
    paperId: get(paperId),
    paperList: get(paperList),
  };
  const res = await proxy.$api.savePaperRecords(params);
  return res.data || null;
};
const initPaper = (list) => {
  let num = 1;
  const paperListVal = {};
  const typeListVal = [];
  list.forEach((item) => {
    const key = Object.keys(item)[0];
    let value = item[key];
    value = value.map((questionItem, questionIndex) => {
      if (key != '编程题') {
        questionItem.objOption = JSON.parse(questionItem.objOption);
        questionItem.key = questionItem.ifMultiple ? [] : null;
        questionItem.objAnswerArr = questionItem.objAnswer.split(',');
        if (questionItem.objImage) {
          questionItem.myObjImage = JSON.parse(questionItem.objImage) || [];
        }
      } else {
        questionItem.key = '';
      }
      questionItem.preface = num + questionIndex;
      questionItem.isSubmit = false;
      questionItem.isThinking = false;
      questionItem.subTime = 0;
      return questionItem;
    });
    paperListVal[key] = {
      children: value,
      doneQuestion: 0,
      isComplete: false,
      num,
      isExpand: false,
    };
    typeListVal.push(key);
    num += value.length;
  });
  set(totalQuestionNum, num - 1);
  return { paperListVal, typeListVal };
};
onMounted(async () => {
  set(paperId, props.paperId);
  const historyList = await getPaperRecords();
  if (Object.keys(historyList)?.length) {
    set(paperList, historyList);
    set(typeList, Object.keys(historyList));
    let num = 0;
    Object.keys(historyList).forEach((typeKey) => {
      num += historyList[typeKey].children.length;
    });
    set(totalQuestionNum, num);
  } else {
    const course_chapter_paper = await proxy.$api.getObjInfoByPaperId({
      paperId: get(paperId),
    });
    const paper = course_chapter_paper.data.paper;
    if (
      props.course_chapter_content.ifExistOperate ||
      props.course_chapter_content.ifExistCompile
    ) {
      let course_chapter_compile =
        props.course_chapter_content.langName == 'scratch'
          ? await proxy.$api.getOperateInfoByPaperId({
              paperId: get(paperId),
            })
          : await proxy.$api.getCompileInfoByPaperId({
              paperId: get(paperId),
            });
      const compiles =
        props.course_chapter_content.langName == 'scratch'
          ? course_chapter_compile.data.operates
          : course_chapter_compile.data.compiles;
      if (compiles) {
        paper.push({ 编程题: compiles });
      }
    }
    const { paperListVal, typeListVal } = initPaper(paper);
    set(paperList, paperListVal);
    set(typeList, typeListVal);
  }

  const keyName = Object.keys(get(paperList))[0];
  get(paperList)[keyName].isExpand = true;
  activeObj.questionType = keyName;
  activeObj.preface = 1;
  activeObj.questionNum = 0;
  set(isInit, true);
  set(examBeginTime, dayjs().format('YYYY-MM-DD HH:mm:ss'));
});

watch(
  () => activeObj.questionType,
  (data) => {
    if (props.course_chapter_content?.langName == 'scratch')
      if (data == '编程题') {
        window.removeEventListener('message', handleMessage);
        window.addEventListener('message', handleMessage);
      }
  }
);
let firstTIme = null;
watch(
  () => activeObj.preface,
  (data) => {
    firstTIme = new Date();
    if (props.course_chapter_content?.langName == 'scratch')
      if (get(activeObj.questionType) == '编程题') {
        console.log(data);
        nextTick(() => {
          postMessage({ type: 'loadData', data: get(nowQuestion).key });
        });
      }
  }
);

const nowQuestion = computed(() => {
  if (!get(isInit)) return {};
  return get(paperList)[activeObj.questionType]?.children[
    activeObj.questionNum
  ];
});

onBeforeUnmount(() => {
  savePaperRecords();
  window.removeEventListener('message', handleMessage);
});

const handleMessage = async (e) => {
  if (e.data.constructor !== String) return;
  // console.log('vue接收到的数据======', JSON.parse(e.data));
  if (e.data) {
    const { type, data } = JSON.parse(e.data);
    console.log(type, data);
    switch (type) {
      case 'getInitType':
        postMessage({ type: 'getInitType', data: 'homework' });
        postMessage({ type: 'loadData', data: get(nowQuestion).key });
        break;
      case 'submitCode':
        const params = {
          stuId: userStore?.userInfo?.stuId,
          paperId: get(paperId),
          operateId: get(nowQuestion).operateId,
          operateNum: '1',
          scratchFile: data,
          time: Math.ceil(
            (new Date().getTime() - new Date(firstTIme).getTime()) / 1000
          ),
        };
        const res = await proxy.$api.getScratchAnswer(params);
        if (res.resultCode == 200) {
          proxy.$message.success('提交成功');
          get(nowQuestion).key = data;
          toSubmitItem();
        } else {
          proxy.$message.warn('提交失败');
        }
        firstTIme = new Date();
        break;
      case 'viewResolution':
        toThinkingItem();
        break;
      case 'changeStep':
        changeStep(data);
        break;
    }
  }
};
const scratchRef2 = ref();
const postMessage = (message) => {
  const iframeWin = get(scratchRef2)?.contentWindow;
  iframeWin?.postMessage({ ...message }, '*');
};
const paperList = ref([]);
const typeList = ref([]);

// 计算大题已完成数目
const computeCompletedQuestion = (obj) => {
  let doneNums = 0;
  obj.children.forEach((objItem) => {
    if (objItem.isSubmit) doneNums++;
  });
  if (doneNums == obj.children.length) obj.isComplete = true;
  obj.doneQuestion = doneNums;
};

const totalQuestionNum = ref(0); //总题数

const compileIndex = ref(0);

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

// 恢复试卷置顶
const resetPosition = (id) => {
  const content = document.querySelector(id);
  content.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

// // 客观题提交答案
// const submitAnswers = () => {
//   compileThinking();
// };
// 提交答案
const toSubmitItem = () => {
  const typeObj = get(paperList)[activeObj.questionType];
  typeObj.children[activeObj.questionNum].isSubmit = true;
  if (activeObj.questionType != '编程题') {
    typeObj.children[activeObj.questionNum].subTime = Math.ceil(
      (new Date().getTime() - new Date(firstTIme).getTime()) / 1000
    );
  }
  typeObj.children[activeObj.questionNum].isThinking = true;
  computeCompletedQuestion(typeObj);
};
// 查看思路
const toThinkingItem = () => {
  const typeObj = get(paperList)[activeObj.questionType];
  typeObj.children[activeObj.questionNum].isThinking = true;
};

const outputValue = ref('');
const inputValue = ref('');
// 运行代码
const runCode = async () => {
  const params = {
    stuId: userStore?.userInfo?.stuId,
    paperId: get(paperId),
    compileId: get(nowQuestion).compileId,
    langName: get(nowQuestion).langName,
    code: proxy.$refs.editorRef.getValue(),
    input: get(inputValue),
  };
  const res = await handleCompile(params);
  const result = JSON.parse(res.data).result;
  set(outputValue, result.output);
  proxy.$message.info(res.resultMsg);
};
// 提交代码
const subCode = async () => {
  const params = {
    stuId: userStore?.userInfo?.stuId,
    paperId: get(paperId),
    compileId: get(nowQuestion).compileId,
    langName: get(nowQuestion).langName,
    code: proxy.$refs.editorRef.getValue(),
    time: Math.ceil(
      (new Date().getTime() - new Date(firstTIme).getTime()) / 1000
    ),
  };
  const res = await getCompileAnswer(params);
  if (res.resultCode == 200) {
    proxy.$message.success('提交成功');
    get(nowQuestion).key = proxy.$refs.editorRef.getValue();
    toSubmitItem();
  }
  firstTIme = new Date();
};
const emit = defineEmits(['submitPaper']);

const submitPaper = async () => {
  const typeList = ['单选题', '多选题', '判断题', '程序阅读题'];
  const arr = [];
  typeList.forEach((item) => {
    if (get(paperList)[item]) {
      const questionArr = [];
      get(paperList)[item].children.forEach((questionItem, questionIndex) => {
        const obj = {
          objId: questionItem.objId,
          objType: questionItem.objType,
          paperId: get(paperId),
          objNum: questionIndex,
          time: questionItem.subTime,
        };

        if (questionItem.ifMultiple) {
          obj.answer =
            questionItem.key.length == 0 ? '' : questionItem.key.join(',');
        } else {
          obj.answer = questionItem.key ? questionItem.key : '';
        }
        questionArr.push(obj);
      });
      arr.push(questionArr);
    } else {
      arr.push([]);
    }

    // const key = Object.keys(item)[0];
    // let value = item[key];
  });
  const res = await proxy.$api.judgeAnswer(
    { stuId: userStore?.userInfo?.stuId, isHomework: true },
    arr
  );
  const params2 = {
    examBeginTime: get(examBeginTime),
    examEndTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    stuId: userStore?.userInfo?.stuId,
    paperId: get(paperId),
  };
  const res2 = await proxy.$api.createExamResult(params2);

  const params3 = {
    chapterId: proxy.$route.query.chapterId,
    unitId: proxy.$route.query.unitId,
  };
  const res3 = await proxy.$api.updateDoObjStudyState(params3);
  emit('submitPaper');
};
</script>

<style lang="less" scoped>
.homeworkBeingDone_box {
  display: flex;
  justify-content: space-between;
  background: #f3f3f3;
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
