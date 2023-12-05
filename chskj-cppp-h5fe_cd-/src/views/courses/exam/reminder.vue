<!--
 * @Date: 2023-05-16 11:57:22
 * @LastEditTime: 2023-05-16 14:09:43
-->
<template>
  <div class="tips_box">
    <a-button
      class="tips_btn"
      type="ghost"
      @click="$router.push({ name: 'content', query: { ccId, courseId } })"
    >
      课程单元
      <template #icon>
        <img src="@/assets/learn/rollback.png" />
      </template>
    </a-button>
    <div class="tips_text" :style="isNeededUpdate ? 'color: #be5a00;' : ''">
      <img
        :src="
          isNeededUpdate
            ? require('@/assets/course/warn.png')
            : require('@/assets/course/success.png')
        "
        class="icon2"
      />
      经系统检测，您的电脑配置为：{{ systemVersion }} / {{ browserVersion }}
      <!-- / 内存16G / 硬盘可用空间125GB -->
    </div>
  </div>
  <div class="message_box">
    <p class="text1">
      <img src="@/assets/course/in_exam.png" class="icon" />
      <span>{{ course }} - {{ unit }}</span>
    </p>
    <p class="text2">{{ chapter }}</p>
    <p class="text3">
      <img src="@/assets/course/warn.png" class="icon2" />
      尊敬的学员，感谢您参加本门课程的单元测试，我们预祝各位取得优异的成绩！为确保测试顺利进行，特别提醒以下事项：
    </p>
    <ol class="tips">
      <!-- 须知 -->
      <li>
        1、建议使用最新版本的<span class="color_0052D9"> Chrome </span>或<span
          class="color_0052D9"
        >
          Edge </span
        >浏览器，以保证页面功能的兼容性；
      </li>
      <!-- <li>2、赛前测试必须使用Chrome（谷歌）浏览器最新版本；</li> -->
      <li>
        2、本次{{ chapterType == 2 ? '测试' : '考试' }}包含{{ text }}部分，共
        <span class="color_0052D9"> {{ num }} </span>
        题。客观题部分完成后，请提交并进入主观题作答；
      </li>
      <li>
        3、赛前{{
          chapterType == 2 ? '测试' : '考试'
        }}，试题不变，不判卷，不计算成绩；
      </li>
      <li>
        4、本次{{ chapterType == 2 ? '测试' : '考试' }}总时长为<span
          class="color_0052D9"
        >
          {{ time }} </span
        >分钟，您可以根据自己的进度提前交卷；
      </li>
      <ul>
        <li>
          操作系统：Windows 7、Windows 8、Windows 10、macOS 10.13 或更高版本；
        </li>
        <li>浏览器：Chrome 109或更高版本、Edge最新版本；</li>
        <li>内存不低于8G，硬盘可用空间不低于60GB；</li>
        <li>网络要求：建议 100Mbps</li>
      </ul>
    </ol>
    <div class="button_box">
      <a-button
        @click="toExam"
        :class="chapterType == 2 ? 'm_button' : 'm_button2'"
        >进入{{ chapterType == 2 ? '测试' : '考试' }}</a-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { useUserStore, useCommonStore } from '@/store';
import { browserAcomputer, browserRealease } from '@/utils/browserUtils';
import { get, set } from '@vueuse/core';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();
let courseId, ccId, paperId;

onMounted(() => {
  courseId = proxy.$route.query.courseId;
  ccId = proxy.$route.query.ccId;
  paperId = proxy.$route.query.paperId;
  getSysInfo();
  getPaperStatus();
});

let course = ref(''),
  unit = ref(''),
  chapter = ref(''),
  time = ref(0),
  num = ref(0),
  text = ref('');
const getPaperWaitingMsg = async () => {
  const res = await proxy.$api.getPaperWaitingMsg({ paperId });
  if (res.resultCode == 200) {
    const {
      courseName,
      unitName,
      chapterName,
      paperNums,
      paperSumTime,
      paperType,
    } = res.data;
    const typeArr = paperType.split('、');
    if (typeArr.length == 2) {
      set(text, `${typeArr[0]}和${typeArr[1]}两`);
    } else {
      set(text, `${typeArr[0]}一`);
    }
    set(course, courseName);
    set(unit, unitName);
    set(chapter, chapterName);
    set(time, paperSumTime);
    set(num, paperNums);
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
let systemVersion = ref(''),
  browserVersion = ref(''),
  isNeededUpdate = ref(false);
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
    } else {
      getPaperWaitingMsg();
    }
  }
};
// 系统信息获取
const getSysInfo = () => {
  const os = require('os');
  const SysInfo = browserAcomputer();
  set(systemVersion, SysInfo.system.systemVersion);
  set(browserVersion, SysInfo.browser.browserVersion);
  isNeededUpdate = browserRealease().isNeededUpdate;
};

// 点击进入考试/测试
const toExam = () => {
  // return;
  proxy.$router.push({
    name: 'exam',
    query: {
      paperId,
      courseId,
      ccId,
    },
  });
};
</script>

<style lang="less" scoped>
.tips_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 56px;
  background: #f9f6d0;
  opacity: 1;
  .tips_btn {
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border-color: #0052d9;
    color: #0052d9;
    font-size: 14px;
    padding: 2px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }
  .tips_text {
    font-size: 14px;
    line-height: 22px;
  }
}
.message_box {
  margin: 48px auto;
  padding: 80px 179px 52px 179px;
  width: 1408px;
  background: #ffffff;
  border-radius: 24px;
  .text1 {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
    .icon {
      margin-right: 8px;
      width: 28px;
    }
  }
  .text2 {
    margin-bottom: 16px;
    font-size: 36px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    line-height: 44px;
  }
  .text3 {
    margin-bottom: 24px;
    padding: 13px 17px;
    background: #f9f6d0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #8b572a;
  }
  .color_0052D9 {
    color: #0052d9;
  }
  .tips {
    padding-left: 24px;
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
    line-height: 48px;
    ul {
      transform: translateX(23px);
      li {
        list-style-type: disc;
      }
    }
  }
  .button_box {
    display: flex;
    justify-content: center;
    .m_button {
      width: 320px;
      height: 64px;
      background: #e37318;
      box-shadow: 0px 4px 0px 0px #9e3610;
      border: unset;
      border-radius: 100px;
      font-size: 28px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }
    .m_button2 {
      width: 320px;
      height: 64px;
      background: #366ef4;
      box-shadow: 0px 4px 0px 0px #0052d9;
      border: unset;
      border-radius: 100px;
      font-size: 28px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}
.icon2 {
  margin-right: 2px;
  height: 22px;
}
</style>
