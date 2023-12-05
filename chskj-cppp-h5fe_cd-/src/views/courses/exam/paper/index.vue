<!--
 * @Date: 2023-05-16 11:57:22
 * @LastEditTime: 2023-05-16 14:09:43
-->
<template>
  <div class="exam_main" ref="exam">
    <!-- 加载试卷loading -->
    <div class="spin_box" v-if="isLoading">
      <a-spin size="large" tip="试卷加载中..." />
    </div>
    <!-- 客观类型试卷 -->
    <objPaper
      v-if="!isLoading && !temStatus"
      :list="list"
      :deadline="deadline"
      @showSubmitModal="showSubmitModal"
      @submit="earlySubmit"
    />
    <!-- scratch类型试卷 -->
    <scratchPaper
      v-if="!isLoading && temStatus && isScratch"
      :list="list"
      :paperId="paperId"
      @showSubmitModal="showSubmitModal"
      @earlySubmit="earlySubmit"
      @submit="earlySubmit"
      ref="scratchComponent"
    />
    <!-- python/cpp类型试卷 -->
    <pythonPaper
      v-if="!isLoading && temStatus && !isScratch"
      :list="list"
      @showSubmitModal="showSubmitModal"
      @submit="earlySubmit"
    />
    <a-modal
      :getContainer="() => $refs.exam"
      v-model:visible="isShowSubmitModal"
      :footer="null"
      :closable="false"
      :maskClosable="false"
    >
      <div class="title">
        <img src="@/assets/course/info.png" alt="" class="icon" />
        <span>提交提示</span>
      </div>
      <div class="content" v-if="!temStatus">
        尊敬的学员，您即将提交客观题部分的答案。请再次确认:<br />
        1、您已经仔细检查过客观题所有答案，不需要再修改；<br />
        2、提交后,您将进入主观题部分，无法再返回客观题修改答案；<br />
        3、您已将客观题答案保存备份,以防不小心提交；<br />
        4、您已做好准备进入主观题部分作答。<br />
        如果以上都确认无误，请点击“确认提交客观题”。<br />
        否则，建议您仔细检查并完善客观题答案后再提交。<br />
      </div>
      <div class="content" v-if="temStatus">
        尊敬的学员，我们注意到您点击了交卷按钮，请确认以下信息:<br />
        1、您确定要交卷吗？提交后不能再修改答案；<br />
        2、您的答案已经保存备份，以防不小心提交；<br />
        3、您已经检查过所有题目，对现有答案满意。<br />
        <br />
        由于交卷后无法再修改答案，如果以上都确认无误，建议您仔细思考后再交卷。如果需要修改或完善答案，您可以返回继续作答。
      </div>
      <div class="btn_box">
        <a-button
          :disabled="!isShowSubmitModal"
          @click="() => (isShowSubmitModal = false)"
          class="btn_on"
          >继续答题</a-button
        >
        <a-button
          :disabled="!isShowSubmitModal"
          @click="submitPaper"
          class="btn_submit"
          >确认提交</a-button
        >
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { useUserStore, useCommonStore } from '@/store';
import { get, set } from '@vueuse/core';
import dayjs from 'dayjs';
import objPaper from './objPaper.vue';
import scratchPaper from './scratchPaper.vue';
import pythonPaper from './pythonPaper.vue';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();
let paperId, ccId, courseId;

onMounted(() => {
  paperId = proxy.$route.query.paperId;
  courseId = proxy.$route.query.courseId;
  ccId = proxy.$route.query.ccId;
  getPaperStatus();
});
let course = ref(''),
  unit = ref(''),
  chapter = ref('');
const getPaperWaitingMsg = async (paperId) => {
  const res = await proxy.$api.getPaperWaitingMsg({ paperId });
  if (res.resultCode == 200) {
    const { courseName, unitName, chapterName } = res.data;
    set(course, courseName);
    set(unit, unitName);
    set(chapter, chapterName);
    if (courseName == '华园科创') {
      commonStore.s_set_breadcrumb([
        {
          label: courseName,
          href: `/classification/category`,
        },
        { label: unitName, href: `/exercise/database` },
        { label: chapterName },
      ]);
    } else {
      commonStore.s_set_breadcrumb([
        {
          label: courseName,
          href: `/classification/content?ccId=${ccId}&courseId=${courseId}`,
        },
        { label: unitName },
        { label: chapterName },
      ]);
    }
  }
};
/**
 * 获取考生状态/试卷模块
 */
const temStatus = ref(false); // 是否显示编程题
const isNext = ref(false); // 是否存在下一份试卷
const isScratch = ref(false); // 是为操作题类型否存在下一份试卷
let isLoading = ref(true); // 试卷是否正在加载
const examBeginTime = ref(null);

// 获取学生paper的状态
const getPaperStatus = async () => {
  const params = {
    paperId,
    stuId: userStore?.userInfo?.stuId,
  };
  const res = await proxy.$api.getPaperStatus(params);
  if (res.resultCode == 200) {
    const { existObj, existCompile, finishedObj, existOperate, paperState } =
      res.data;
    if (paperState == 2) {
      proxy.$router.push({
        name: 'summary',
        query: {
          paperId,
          courseId,
          ccId,
        },
      });
    }
    getPaperWaitingMsg(paperId);
    const isCompile = existCompile || existOperate;
    if (isCompile) {
      set(isScratch, existOperate);
    }
    set(examBeginTime, dayjs().format('YYYY-MM-DD HH:mm:ss'));
    set(temStatus, isCompile && finishedObj);
    set(isNext, isCompile && !finishedObj);
    getExamPaper();
  }
};
// 获取考试试卷
const getExamPaper = () => {
  set(isLoading, true);
  if (get(temStatus)) {
    getCompilePaper();
  } else {
    getPaper();
  }
};

/**
 * 获取考卷信息模块
 */
const list = ref([]); // 试卷数据
let startTime = null; // 考试开始时间
let endTime = null; // 考试截止时间
// 获取系统时间
const getAccess = () => {
  return new Promise(async (resolve, reject) => {
    const res = await proxy.$api.getAccess();
    if (res.resultCode == 200) {
      resolve(res.data.time);
    }
  });
};
// 获取客观比赛试题
const getPaper = async () => {
  const res = await proxy.$api.getObjInfoByPaperId({ paperId });
  if (res.resultCode == 200) {
    console.log(res);
    set(list, initList(res.data.paper));
    // startTime = res.data.startTime;
    endTime = res.data.endTime;
    // getLsList();
    initPaper();
    set(isLoading, false);
  }
};
// 获取编译比赛试题数据
const getCompilePaper = async () => {
  const res = get(isScratch)
    ? await proxy.$api.getOperateInfoByPaperId({ paperId })
    : await proxy.$api.getCompileInfoByPaperId({ paperId });
  if (res.resultCode == 200) {
    const compileData = get(isScratch) ? res.data.operates : res.data.compiles;
    console.log(compileData);
    set(list, {
      name: get(isScratch) ? '操作题' : '编程题',
      children: compileData.map((item) => {
        item.userCode = '';
        item.imgArr = item.questionImage ? JSON.parse(item.questionImage) : [];
        return item;
      }),
    });
    set(isLoading, false);
    endTime = res.data.endTime;
    startTime = res.data.startTime;
    initPaper();
  }
};
// 处理返回的客观题试卷数据
const initList = (list) => {
  let num = 1;
  const paperListVal = [];
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
      questionItem.subTime = 0;
      return questionItem;
    });
    paperListVal.push({
      children: value,
      num,
      name: key,
    });
    num += value.length;
  });
  return paperListVal;
};

/**
 * 初始话试卷模块
 */
const deadline = ref(0); // 倒计时
let deadlineTipsTimer = null; // 倒计时弹窗定时器
let deadlineTipsTime = ref(0); // 倒计时弹窗显示的分钟
let isdeadlineTipsShow = ref(false); // 倒计时弹窗显示的分钟
// 初始话试卷所需参数
const initPaper = () => {
  // clearInterval(deadlineTipsTimer);
  setCounter();
};

// 倒计时
const setCounter = async () => {
  const systemTime = await getAccess(); // 系统时间
  let duration;
  duration = new Date(endTime).getTime() - new Date(systemTime).getTime();
  set(deadline, new Date(new Date().getTime() + duration).getTime());
  // setDeadlineTips(duration);
};
/**
 * 试卷操作模块
 */

const isShowSubmitModal = ref(false); // 是否显示交卷提示弹窗
// 展示弹窗
const showSubmitModal = () => {
  set(isShowSubmitModal, true);
};
/**
 * 交卷模块
 */
// 点击交卷
const submitPaper = async () => {
  // temStatus判断当前试卷类型 1.true:编程/操作题 2.false:客观题
  if (get(temStatus)) {
    // 交卷生成记录
    earlySubmit();
  } else {
    // 客观题交卷
    judgeAnswer();
  }
};

// 客观题部分交卷
const judgeAnswer = async () => {
  const typeList = ['单选题', '多选题', '判断题', '程序阅读题'];
  const paperList = {};
  get(list).forEach((item) => {
    paperList[item.name] = item.children;
  });
  const arr = [];
  typeList.forEach((item) => {
    if (paperList[item]) {
      const questionArr = [];
      paperList[item].forEach((questionItem, questionIndex) => {
        const obj = {
          objId: questionItem.objId,
          objType: questionItem.objType,
          paperId,
          objNum: questionIndex,
          time: 0,
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
    { stuId: userStore?.userInfo?.stuId, isHomework: 'false' },
    arr
  );
  if (res.resultCode == 200) {
    if (get(isNext)) {
      set(temStatus, true);
      getExamPaper();
      set(isShowSubmitModal, false);
      set(isNext, false);
    } else {
      // 没有下一场考试
      earlySubmit();
    }
  }
};
// 整体交卷
const earlySubmit = async (release = false) => {
  const params2 = {
    examBeginTime: get(examBeginTime),
    examEndTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    stuId: userStore?.userInfo?.stuId,
    paperId,
  };
  const res2 = await proxy.$api.createExamResult(params2);
  proxy.$router.push({
    name: 'summary',
    query: {
      paperId,
      courseId,
      ccId,
    },
  });
};
</script>

<style lang="less" scoped>
.exam_main {
  background: #f3f3f3;
}
.spin_box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
  background: #ffffff;
  :deep(.ant-spin-text) {
    font-size: 26px;
    font-weight: 600;
  }
}
:deep(.ant-modal) {
  margin: 0;
  top: 240px;
  left: 720px;
  .ant-modal-content {
    padding: 32px;
    width: 480px;
    height: fit-content;
    background: #ffffff;
    border-radius: 9px;
    box-sizing: border-box;
    position: relative;
    .ant-modal-body {
      padding: 0;
    }
    .title {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
    }
    .icon {
      width: 28px;
    }
    .content {
      margin-bottom: 24px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 22px;
    }
    .btn_box {
      display: flex;
      justify-content: end;
    }
    .btn_box2 {
      display: flex;
      justify-content: space-between;
    }
    .btn_on {
      height: 32px;
      background: #f2f3ff;
      border-radius: 3px;
      border: 1px solid #366ef4;
      font-size: 14px;
      color: #0052d9;
    }
    .btn_warn {
      height: 32px;
      background: #e37318;
      border-radius: 3px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
    }
    .btn_submit {
      margin-left: 8px;
      height: 32px;
      background: #2ba471;
      border-radius: 3px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}
</style>
