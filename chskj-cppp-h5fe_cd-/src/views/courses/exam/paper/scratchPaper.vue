<template>
  <!-- 提示栏 -->
  <div class="tips_box">
    <div class="left_box">
      <img src="@/assets/course/error.png" class="left_icon" />
      <span class="text">
        请进入 [作答区域] 标签页，完成Scratch编程题并 [保存并提交] 答案。
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
  <div class="compile_scratch_box" ref="paper">
    <div class="paper">
      <div class="tabs_box">
        <div class="btn_box">
          <a-button
            class="m_btn"
            :class="{ active_btn: btnValue == 0 }"
            @click="changeBtnValue(0)"
            >题目内容</a-button
          >
          <a-button
            class="m_btn"
            :class="{ active_btn: btnValue == 1 }"
            @click="changeBtnValue(1)"
            >作答区域</a-button
          >
        </div>
      </div>
      <div class="paper_content">
        <div class="paper_main" v-if="btnValue == 0">
          <p class="title">
            {{ nowQuestionIndex + 1 }}、Scratch操作题
            {{ String(nowQuestionIndex + 1).padStart(2, '0') }}
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
          <img
            v-for="(item, index) in nowQuestion.imgArr"
            :src="item"
            class="img"
          />
        </div>
        <template v-if="btnValue == 1">
          <iframe
            class="scratch_box"
            :src="VUE_APP_SCRATCH_URL"
            ref="scratchRef"
            frameborder="0"
          ></iframe>
        </template>
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
                    finish: questionItem.key,
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
import { useUserStore } from '@/store';

const { VUE_APP_SCRATCH_URL } = process.env;

const emit = defineEmits(['showSubmitModal', 'submit']);

const { proxy } = getCurrentInstance(),
  userStore = useUserStore();
const props = defineProps({
  list: { type: Object },
  type: { type: Number, default: -1 },
});
const btnValue = ref(0);

const nowQuestionIndex = ref(0);
const nowQuestion = computed(() => {
  return get(list).children[get(nowQuestionIndex)];
});
const changeBtnValue = (val) => {
  set(btnValue, val);
};
const changeQuestionIndex = (index) => {
  set(nowQuestionIndex, index);
  set(btnValue, 0);
};
const list = toRef(props, 'list');

watch(
  () => btnValue.value,
  (data) => {
    if (data == 1) {
      window.removeEventListener('message', handleMessage);
      window.addEventListener('message', handleMessage);
      getScratchAnswerInfo();
    }
  }
);
const handleMessage = async (e) => {
  if (e.data.constructor !== String) return;
  // console.log('vue接收到的数据======', JSON.parse(e.data));
  if (e.data) {
    const { type, data } = JSON.parse(e.data);
    console.log(type, data);
    switch (type) {
      case 'getInitType':
        postMessage({ type: 'getInitType', data: 'exam' });
        postMessage({ type: 'loadData', data: get(nowQuestion).key });
        break;
      case 'saveAndSubmitCode':
        const params = {
          stuId: userStore?.userInfo?.stuId,
          paperId: get(paperId),
          operateId: get(nowQuestion).operateId,
          operateNum: '1',
          scratchFile: data,
          time: 0,
        };
        const res = await proxy.$api.getScratchAnswer(params);
        if (res.resultCode == 200) {
          proxy.$message.success('提交成功');
        } else {
          proxy.$message.warn('提交失败');
        }
        // saveScratchAnswer(data);
        // firstTIme = new Date();
        break;
    }
  }
};
const scratchRef = ref();

// 获取保存代码
const getScratchAnswerInfo = async () => {
  const params = {
    stuId: userStore?.userInfo?.stuId,
    operateId: get(nowQuestion).operateId,
    paperId,
  };
  const res = await proxy.$api.getScratchAnswerInfo(params);
  if (res.data) {
    get(nowQuestion).key = res.data.scratchFile;
  }
};

const postMessage = (message) => {
  const iframeWin = scratchRef.value?.contentWindow;
  console.log(1234, iframeWin);
  iframeWin?.postMessage({ ...message }, '*');
};
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
const changeValue = ref(0); // 切换题序标识

const isShowChangeModal = ref(false); // 是否显示切换提示弹窗
const isShowAutoModal = ref(false); // 交卷自动提交弹窗

// 初始话试题提示数
const initPaper = () => {
  cmpAllQuestion();
  cmpQuestion();
};
// 计算总题数
const cmpAllQuestion = () => {
  allQuestion.value = list.value.children.length;
};
// 计算已做/未做题目数
const cmpQuestion = () => {
  let doneNums = 0;
  list.value.children.forEach((item) => {
    if (item.submittedTimes) doneNums++;
  });
  doneQuestion.value = doneNums;
  unsettledQuestion.value = allQuestion.value - doneNums;
};
let paperId;
onMounted(() => {
  paperId = proxy.$route.query.paperId;
  initPaper();
});
onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage);
  // clearInterval(infoInterval1);
  // clearInterval(infoInterval2);
});
// 向scrtch编辑器发送数据
const sentData = (optionType) => {
  const iframeWin = proxy.$refs.iframe.contentWindow;
  iframeWin.postMessage(
    {
      last: {
        compileId:
          list.value[compileIndex.value - changeValue.value]?.compileId,
        compileNum:
          list.value[compileIndex.value - changeValue.value]?.compileNum,
      },
      current: {
        compileId: list.value[compileIndex.value]?.compileId,
        compileNum: list.value[compileIndex.value]?.compileNum,
      },
      optionType,
      type: type.value,
      stuId: sessionStorage.getItem('stuId'),
      paperId,
    },
    '*'
  );
};

// 确认自动提交当前答案
const autoSubmit = async () => {
  autoStatus.value = 2;
};
// 不提交当前答案
const cancelAutoSubmit = async () => {
  emit('submit');
  updateAutoSubmit(1);
};
// 更新比赛结束自动提交状态
const updateAutoSubmit = async (autoSubmit) => {
  const params = {
    autoSubmit,
  };
  const res = await proxy.$api.updateAutoSubmit(params);
};

const autoNum = ref(0); // 自动提交次数
const autoStatus = ref(0); // 自动提交当前状态
const autoTime = ref(0); // 自动交卷倒计时秒数
// 倒计时结束交卷
const onFinish = () => {
  // if (get(nowQuestion).submittedTimes) {
  //   return showAutoModal();
  // }
  // emit('submit');
};
// 打开自动交卷提示弹窗
const showAutoModal = () => {
  isShowAutoModal.value = true;
  autoStatus.value = 1;
  autoNum.value = 0;
  autoTime.value = 5;
  setTimeout(() => {
    if (autoStatus.value == 1) {
      emit('earlySubmit', true);
    }
  }, 10000);
};
const showSubmitModal = () => {
  // emit('showSubmitModal');
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
    .text {
      color: #be5a00;
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
.compile_scratch_box {
  display: flex;
  .paper {
    width: 1520px;
    background: #ffffff;
    .tabs_box {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 52px;
      background: #ffffff;
      .btn_box {
        padding: 4px;
        background: #f3f3f3;

        .m_btn {
          width: 80px;
          height: 32px;
          background: #f3f3f3;
          border-radius: 4px;
          border: unset;
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.6);
          &:nth-of-type(1) {
            margin-right: 4px;
          }
        }
        .active_btn {
          color: rgba(255, 255, 255, 0.9);
          background: #00a870;
        }
      }
    }
    .paper_content {
      height: calc(100vh - 172px);
      background: #f2f3ff;
      overflow-y: auto;
      &::-webkit-scrollbar {
        // width: 0;
        // height: 0;
      }
      .paper_main {
        margin: 16px;
        padding: 16px 24px;
        height: fit-content;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #dcdcdc;
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
      .scratch_box {
        width: 100%;
        height: 801px;
        background: #fff;
        margin-bottom: 16px;
        background: url('@/assets/learn/scratch.jpg') no-repeat center;
        background-size: cover;
      }
    }
  }
  .card {
    width: 400px;
    height: calc(100vh - 120px);
    background: #f3f3f3;
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
:deep(.ant-modal) {
  margin: 0;
  top: 285px;
  left: 458px;
  .ant-modal-content {
    padding-bottom: 60px;
    width: 1004px;
    // height: 510px;
    background: #ffffff;
    border-radius: 24px;
    border: 5px solid #bbd3fb;
    .ant-modal-body {
      padding: 0;
    }
    .modal-title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      background: #699ef5;
      border-radius: 24px;
      font-size: 36px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }
    .content {
      margin: 64px 0;
      font-size: 28px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
      line-height: 64px;
      text-align: center;
    }
    .content2 {
      margin-top: 56px;
      font-size: 28px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
      line-height: 64px;
      text-align: center;
    }
    .content3 {
      margin-top: 56px;
      font-size: 28px;
      font-weight: 600;
      color: #3d3d3d;
      line-height: 64px;
      text-align: center;
    }
    .text_box {
      margin-top: 32px;
    }
    .red_color {
      font-size: 28px;
      color: #ff0000;
      font-weight: 600;
    }
    .modal-btn-box {
      display: flex;
      justify-content: space-between;
      padding: 0 160px;
    }
    .modal-btn-box2 {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      .modal-cancel {
        box-shadow: unset;
      }
    }
    .modal-on {
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
    .modal-submit {
      width: 320px;
      height: 64px;
      background: #00a870;
      border-radius: 32px;
      font-size: 28px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      box-shadow: 0px 4px 0px 0px #056334;
      border: unset;
    }
    .modal-no {
      width: 320px;
      height: 64px;
      background: #ed7b2f;
      border-radius: 32px;
      font-size: 28px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      box-shadow: 0px 4px 0px 0px #9e3610;
      border: unset;
    }
    .modal-cancel {
      width: 320px;
      height: 64px;
      background: #f3f3f3;
      border-radius: 32px;
      font-size: 28px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
      box-shadow: 0px 4px 0px 0px #c5c5c5;
      border: unset;
    }
  }
}
</style>
