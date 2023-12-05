<template>
  <!-- 提示栏 -->
  <div class="tips_box">
    <div class="left_box">
      <img src="@/assets/course/error.png" class="left_icon" />
      <span class="text">
        请运行代码确认结果后提交代码，本题成绩将以样例通过率最高的提交代码为准。
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
      <a-button
        @click="changeStep(-1)"
        class="step_btn"
        :class="nowQuestionIndex == 0 ? 'disabled' : ''"
        :disabled="nowQuestionIndex == 0"
        >上一题</a-button
      >
      <a-button
        @click="changeStep(1)"
        class="step_btn"
        :disabled="nowQuestionIndex == list.children.length - 1"
        :class="nowQuestionIndex == list.children.length - 1 ? 'disabled' : ''"
        >下一题</a-button
      >
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
  <div class="compile_python_box" ref="python">
    <div class="stem">
      <div class="stem_main">
        <div class="topic_box">
          <p class="topic_title">
            {{ nowQuestionIndex + 1 }}、{{ nowQuestion.langName }}编程题{{
              String(nowQuestionIndex + 1).padStart(2, '0')
            }}
          </p>
          <!-- 题目描述 -->
          <p
            class="describe text_margin"
            v-html="
              (nowQuestion.questionDesc || '').replaceAll(/\n/g, '<br />')
            "
          ></p>
          <!-- 用例输入 -->
          <p class="describe">用例输入：</p>
          <p
            class="describe text_margin"
            v-html="
              (nowQuestion.samples[0].inputSample || '').replaceAll(
                /\n/g,
                '<br />'
              )
            "
          ></p>
          <!-- 用例输出 -->
          <p class="describe">用例输出：</p>
          <p
            class="describe"
            v-html="
              (nowQuestion.samples[0].outputSample || '').replaceAll(
                /\n/g,
                '<br />'
              )
            "
          ></p>
        </div>
      </div>
    </div>
    <div class="answer">
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
        <span class="feedback" v-if="avgTime && !maxTime">
          本次编译运行时间为{{ avgTime }}ms，耗费内存为{{ avgMemory }}MB。
        </span>
        <span class="feedback" v-if="avgTime && maxTime"
          >本次编译运行总时间为{{ avgTime }}ms，共耗费内存为{{
            avgMemory
          }}MB,其中编译运行最长时间为{{ maxTime }}ms，耗费内存为{{
            maxMemory
          }}MB。</span
        >
        <div class="py_operate_box">
          <a-button @click="runCode" class="runCode_btn">
            <template #icon><img src="@/assets/learn/code.png" /></template>
            <span class="btn_text">运行代码</span>
          </a-button>
          <a-button
            @click="subCode"
            :loading="subLoading"
            :disabled="compileBtn"
            class="subCode_btn"
            >提交代码</a-button
          >
          <span class="submit_text" v-if="nowQuestion.submitLimitTimes">
            本题还能提交代码{{
              nowQuestion.submitLimitTimes - nowQuestion.submittedTimes
            }}次，每次提交后需10秒才可再次提交。
          </span>
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
        <div class="card_box_scroll">
          <div class="card_box">
            <div class="card_items">
              <p class="card_items_title">{{ list.name }}</p>
              <div class="card_item_group">
                <div
                  class="card_item"
                  v-for="(questionItem, questionIndex) in list.children"
                  :class="{
                    finish: questionItem.submittedTimes,
                    active: questionIndex == nowQuestionIndex,
                  }"
                  @click="changeQuestionIndex(questionIndex)"
                >
                  {{ questionIndex + 1 }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <a-button @click="showSubmitModal" class="submit_btn">交卷</a-button>
      </div>
    </div>
  </div>
  <a-modal
    :getContainer="() => $refs.python"
    v-model:visible="isShowChangeModal"
    :footer="null"
    :closable="false"
    :maskClosable="false"
  >
    <div class="title">
      <img src="@/assets/course/info.png" alt="" class="icon" />
      <span>系统提示</span>
    </div>
    <div class="content">
      尊敬的学员，我们注意到您切换题目，请选择：<br />
      1、停留在本题继续作答：不切换题目，点击 [停留在本题] 按钮；<br />
      2、不保存代码且切换题目：不保存当前代码，点击 [不保存且切换 ]
      按钮，编辑器中的代码可能丢失；<br />
      3、保存代码且切换题目：保存当前代码，点击 [保存且切换]
      按钮（从其他题目切换至本题时，编辑器中的代码为当前代码）。<br />
      <br />
      请根据自身情况选择合适的操作。
    </div>
    <div class="btn_box2">
      <a-button @click="hiddenChangeModal" class="btn_on">停留在本题</a-button>
      <div class="right">
        <a-button @click="toChangeStep(0)" class="btn_warn"
          >不保存且切换</a-button
        >
        <a-button @click="toChangeStep(1)" class="btn_submit"
          >保存并切换</a-button
        >
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
  ref,
  nextTick,
  computed,
  toRef,
  watch,
} from 'vue';
import { message } from 'ant-design-vue';
import { get, set, toReactive } from '@vueuse/core';
import { Compiler } from '@/components';

const { VUE_APP_SCRATCH_URL } = process.env;
import { useUserStore, useCommonStore } from '@/store';
import { handleCompile, getCompileAnswer } from '@/utils';

const emit = defineEmits(['showSubmitModal', 'submit']);

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();
const props = defineProps({
  list: { type: Object },
  type: { type: Number, default: -1 },
  paperId: { type: Number, default: -1 },
});

const btnValue = ref(0);

const nowQuestionIndex = ref(0);
const nowQuestion = computed(() => {
  return get(list).children[get(nowQuestionIndex)];
});
watch(
  () => get(nowQuestionIndex),
  (data) => {
    getSavedCompileCode();
    set(avgMemory, '');
    set(avgTime, '');
    set(maxMemory, '');
    set(maxTime, '');
  }
);
const changeBtnValue = (val) => {
  set(btnValue, val);
};

const list = toRef(props, 'list');

let infoInterval1 = null;
let infoInterval2 = null;

// 静态资源拼接php域名（前面加mb）
const figureMap = {
  // 大题序号字典
  0: '一',
  1: '二',
  2: '三',
  3: '四',
};
let langType = null; // 1scratch，2C++，3python
let compileId = null; // 竞赛id
const compileIndex = ref(0); // 当前编译索引
const unsettledQuestion = ref(0); // 试卷未做题数
const doneQuestion = ref(0); // 试卷已做题数
const allQuestion = ref(0); // 试卷总题数

const isShowChangeModal = ref(false); // 是否显示切换提示弹窗

// 初始话试题提示数
const initPaper = () => {
  cmpAllQuestion();
  cmpQuestion();
};
// 计算总题数
const cmpAllQuestion = () => {
  set(allQuestion, get(list).children.length);
};
// 计算已做/未做题目数
const cmpQuestion = () => {
  let doneNums = 0;
  get(list).children.forEach((item) => {
    if (item.submittedTimes) doneNums++;
  });
  set(doneQuestion, doneNums);
  set(unsettledQuestion, get(allQuestion) - doneNums);
};
let paperId;

onMounted(() => {
  paperId = proxy.$route.query.paperId;
  initPaper();
  getSavedCompileCode();
});
onBeforeUnmount(() => {});

// 运行代码
const runCode = async () => {
  const params = {
    stuId: userStore?.userInfo?.stuId,
    paperId,
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
const outputValue = ref('');
const inputValue = ref('');
const avgMemory = ref(''); // 答题平均内存消耗
const avgTime = ref(''); // 答题平均时间消耗
const maxMemory = ref(''); // 答题最大内存消耗
const maxTime = ref(''); // 答题最大时间消耗
const compileBtn = ref(false); // 提交按钮是否禁止
const subLoading = ref(false); // 提交代码是否loading状态
// 提交代码
const subCode = async () => {
  try {
    set(subLoading, true);
    set(avgMemory, '');
    set(avgTime, '');
    set(maxMemory, '');
    set(maxTime, '');
    set(compileBtn, true);
    setTimeout(() => {
      set(compileBtn, false);
    }, 10000);
    const params = {
      stuId: userStore?.userInfo?.stuId,
      paperId,
      compileId: get(nowQuestion).compileId,
      langName: get(nowQuestion).langName,
      code: proxy.$refs.editorRef.getValue(),
      time: 0,
    };
    const res = await getCompileAnswer(params);
    if (res.resultCode == 200) {
      set(subLoading, false);
      const {
        accept,
        size,
        message: msg,
        avgMemory: avg_memory,
        avgTime: avg_time,
        maxMemory: max_memory,
        maxTime: max_time,
      } = res.data;
      if (msg == '提交成功') {
        if (accept == size) {
          message.success('代码已提交，通过率100%', 2);
        } else {
          message.warning(
            `代码已提交，通过率${((accept * 100) / size).toFixed(2)}%`,
            2
          );
          set(maxMemory, max_memory);
          set(maxTime, max_time);
        }
        set(avgMemory, avg_memory);
        set(avgTime, avg_time);
        get(nowQuestion).submittedTimes++;
        cmpQuestion();
      } else {
        message.error(msg, 2);
      }
      saveCompileCode();
    }
  } catch (error) {
    set(subLoading, false);
  }
};
// 保存代码
const saveCompileCode = async () => {
  const params = {
    stuId: userStore?.userInfo?.stuId,
    paperId,
    compileId: get(nowQuestion).compileId,
    code: proxy.$refs.editorRef.getValue(),
  };
  const res = await proxy.$api.saveCompileCode(params);
};
// 获取保存代码
const getSavedCompileCode = async () => {
  const params = {
    stuId: userStore?.userInfo?.stuId,
    paperId,
    compileId: get(nowQuestion).compileId,
  };
  const res = await proxy.$api.getSavedCompileCode(params);
  if (res.data) {
    get(nowQuestion).key = res.data.programSave;
  } else {
    get(nowQuestion).key = '';
  }
};
// 交卷
const showSubmitModal = () => {
  emit('showSubmitModal');
};

const changeValue = ref(0);
const changeValueType = ref('');
// 点击答题卡切换题目
const changeQuestionIndex = (val) => {
  showChangeModal(val, 'card');
};
// 编程题试卷点击上/下步
const changeStep = (val) => {
  showChangeModal(val, 'btn');
};
// 展示切换提示弹窗
const showChangeModal = (val, type) => {
  set(changeValue, val);
  set(changeValueType, type);
  set(isShowChangeModal, true);
};
// 隐藏切换提示弹窗
const hiddenChangeModal = () => {
  set(isShowChangeModal, false);
};

const toChangeStep = (val) => {
  if (val) {
    saveCompileCode();
  }

  switch (get(changeValueType)) {
    case 'card':
      set(nowQuestionIndex, get(changeValue));
      break;
    case 'btn':
      set(nowQuestionIndex, get(nowQuestionIndex) + get(changeValue));
      break;
  }
  hiddenChangeModal();
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
  padding: 0 16px 0 28px;
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
    .text {
      color: rgba(0, 0, 0, 0.9);
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

    .step_btn {
      width: 144px;
      height: 40px;
      border-radius: 3px;
      border: 1px solid #366ef4;
      margin-left: 16px;
      background: #ffffff;
      color: #0052d9;
    }
    .disabled {
      background: #eeeeee;
      border: 1px solid #dcdcdc;
      color: rgba(0, 0, 0, 0.26);
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
.compile_python_box {
  display: flex;
  background: #f3f3f3;
  .stem {
    padding: 15px 16px;
    width: 576px;
    height: 100%;
    .stem_main {
      max-height: calc(100vh - 150px);
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
      background: #ffffff;
      border-radius: 16px;
      opacity: 1;
      border: 1px solid #dcdcdc;
      .topic_box {
        padding: 16px 24px;
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
    }
  }
  .answer {
    padding: 15px 16px 23px 16px;
    width: 944px;
    background: #ffffff;
    height: calc(100vh - 120px);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
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
        min-height: 160px;
        background: #282c34;
        border: 1px solid #dcdcdc;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 22px;
      }
      .feedback {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 28px;
      }
      .py_operate_box {
        margin-top: 24px;
        display: flex;
        .runCode_btn,
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
        .submit_text {
          font-size: 16px;
          color: #ed7b2f;
          line-height: 32px;
        }
      }
    }
  }
  .card {
    width: 400px;
    height: calc(100vh - 120px);
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
      .card_box_scroll {
        height: calc(100vh - 340px);
        // background: red;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          width: 0;
        }
      }
      .card_box {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
        .card_item_img {
          position: absolute;
          top: 0;
          right: 0;
          width: 28px;
        }
        .finish {
          background: #ecf2fe;
          border: 1px solid #699ef5;
          color: #0052d9;
        }
        .active {
          background: #366ef4;
          color: rgba(255, 255, 255, 0.9);
        }
      }
      .submit_btn {
        position: absolute;
        bottom: 10px;
        margin: 16px 24px;
        width: 320px;
        height: 64px;
        background: #4787f0;
        border-radius: 32px;
        font-size: 28px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        box-shadow: 0px 4px 0px 0px #0052d9;
        border: unset;
      }
    }
  }
}
</style>
