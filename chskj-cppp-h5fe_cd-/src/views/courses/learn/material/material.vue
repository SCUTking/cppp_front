<!--
 * @Date: 2023-05-10 15:30:05
 * @LastEditTime: 2023-05-10 15:43:13
-->
<template>
  <div class="title_box">
    <div class="title_left">
      <img src="@/assets/learn/icon_player.png" class="title_icon" />
      <span class="title-text">学习视频</span>
    </div>
    <!-- <div class="title_right" @click="showFullScreen(1)" style="cursor: pointer">
      <img src="@/assets/learn/Maximize.png" class="title_icon" />
    </div> -->
  </div>
  <div class="player_box">
    <mvideo
      :videoSrc="props?.courseChapterContent?.chapterVideo"
      @onPlay="onPlay"
    />
  </div>
  <div class="content_box">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="课堂课件"></a-tab-pane>
      <a-tab-pane key="2" tab="学习资料"></a-tab-pane>
    </a-tabs>
    <div class="content_title">
      <div class="content_title_left">
        <img src="@/assets/learn/icon_information.png" class="title_icon" />
        <span class="title-text1">{{
          activeKey == '1'
            ? decodeURIComponent(props?.courseChapterContent?.fileName)
            : decodeURIComponent(props?.courseChapterContent?.materialName)
        }}</span>
        <p
          v-show="activeKey == '2'"
          class="download-text"
          @click="
            download(
              props?.courseChapterContent?.learningMaterial,
              decodeURIComponent(props?.courseChapterContent?.materialName)
            )
          "
        >
          <VerticalAlignBottomOutlined />
          下载资料
        </p>
      </div>
      <div class="content_title_right">
        <span class="title-text2" v-show="activeKey == '1'"
          >当前：第 {{ state.pageNum }} 页 共 {{ state.numPages }} 页</span
        >
        <img
          style="cursor: pointer"
          @click="showFullScreen(2)"
          src="@/assets/learn/Maximize.png"
          class="title_icon"
        />
      </div>
    </div>
    <div class="content_main">
      <div v-show="activeKey == '1'">
        <div class="option_icon option_left" @click="nextPage(-1)">
          <LeftOutlined />
        </div>
        <div class="option_icon option_right" @click="nextPage(1)">
          <RightOutlined />
        </div>
      </div>
      <vue-pdf-embed
        :source="
          activeKey == '1'
            ? props?.courseChapterContent?.chapterFile
            : props?.courseChapterContent?.learningMaterial
        "
        class="pdf_box"
        :page="activeKey == '1' ? state.pageNum : 0"
      />
    </div>
  </div>
  <div class="full_screen" ref="fullScreenRef"></div>
  <a-drawer
    placement="bottom"
    :closable="false"
    height="92.5vh"
    :visible="fullScreenShow"
    :getContainer="() => $refs.fullScreenRef"
  >
    <div class="full_screen_box">
      <div class="icon_box" @click="hiddenFullScreen" style="cursor: pointer">
        <img src="@/assets/learn/Light.png" class="close_icon" />
      </div>
      <!-- <div class="full_screen_title" v-if="fullScreenType == 1">
        <img src="@/assets/learn/icon_player.png" class="title_icon" />
        <span class="title-text">学习视频</span>
      </div> -->
      <div class="full_screen_title" v-if="fullScreenType == 2">
        <img src="@/assets/learn/icon_information.png" class="title_icon" />
        <span class="title-text">{{
          activeKey == '1'
            ? decodeURIComponent(props?.courseChapterContent?.fileName)
            : decodeURIComponent(props?.courseChapterContent?.materialName)
        }}</span>
      </div>
      <div class="full_screen_content">
        <div v-show="activeKey == '1' && fullScreenType == 2">
          <div class="option_icon option_left" @click="nextPage(-1)">
            <LeftOutlined />
          </div>
          <div class="option_icon option_right" @click="nextPage(1)">
            <RightOutlined />
          </div>
        </div>
        <vue-pdf-embed
          v-if="fullScreenType == 2"
          :source="
            activeKey == '1'
              ? props?.courseChapterContent?.chapterFile
              : props?.courseChapterContent?.learningMaterial
          "
          class="pdf_box"
          :page="activeKey == '1' ? state.pageNum : 0"
        />

        <video
          v-if="fullScreenType == 1"
          ref="videoref2"
          class="player_box"
          :src="props?.courseChapterContent?.chapterVideo"
          controls
        ></video>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, onMounted, reactive, watch, getCurrentInstance } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
import mvideo from './mvideo.vue';
import { get, set } from '@vueuse/core';
const { proxy } = getCurrentInstance();

import { createLoadingTask } from 'vue3-pdfjs';
import { download } from '@/utils';
import {
  LeftOutlined,
  RightOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons-vue';
const props = defineProps({
  courseChapterContent: { type: Object },
});

let chapterId, unitId;
onMounted(() => {
  chapterId = proxy.$route.query.chapterId;
  unitId = proxy.$route.query.unitId;
});
const isFirstPlay = ref(true);
const onPlay = async () => {
  if (get(isFirstPlay)) {
    const params = {
      chapterId,
      unitId,
    };
    const res = await proxy.$api.updateWatchVideoStudyState(params);
    if (res.resultCode == 200) {
      console.log(res);
      set(isFirstPlay, false);
    }
  }
};
watch(
  () => props?.courseChapterContent?.chapterFile,
  (data) => {
    if (data) {
      const loadingTask = createLoadingTask(data);
      loadingTask.promise.then((pdf) => {
        state.numPages = pdf.numPages;
      });
    }
  }
);

const state = reactive({
  source: '', // 预览pdf文件地址
  pageNum: 1, // 当前页面
  numPages: 0, // 总页数
});
const activeKey = ref('1'); // 1.课堂课件 2.学习资料
const fullScreenShow = ref(false);
const fullScreenType = ref(0);
const videoref2 = ref('');
const testRef = ref('');
const showFullScreen = (val) => {
  set(fullScreenType, val);
  set(fullScreenShow, true);
};
const hiddenFullScreen = () => {
  if (get(fullScreenType) == 1) {
    get(videoref2).pause();
  }
  set(fullScreenShow, false);
};
const nextPage = (val) => {
  if (state.pageNum + val < 1 || state.pageNum + val > state.numPages) return;
  state.pageNum += val;
};
</script>

<style lang="less" scoped>
video::-webkit-media-controls {
  box-shadow: none;
}
video::-webkit-media-controls-panel {
  box-shadow: none;
}
.title_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;

  .title_left {
    display: flex;
    align-items: center;
  }
  .title_icon {
    margin: 0 8px 0 16px;
    width: 28px;
  }
  .title-text {
    font-size: 16px;
    font-weight: 600;
    line-height: 28px;
  }
}
.player_box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 576px;
  height: 324px;
  object-fit: contain;
  .player_icon {
    width: 100px;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  video:focus {
    outline: none;
  }
}
.content_title {
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  .content_title_left,
  .content_title_right {
    display: flex;
    align-items: center;
  }
  .title_icon {
    width: 28px;
  }
  .download-text {
    margin-left: 11px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #0052d9;
    line-height: 20px;
    cursor: pointer;
    span {
      margin: 0 5px;
      font-size: 18px;
    }
  }
  .title-text1 {
    margin-left: 8px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    max-width: 300px;
    overflow: hidden;
    text-wrap: nowrap;
  }
  .title-text2 {
    margin-right: 8px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
  }
}
.content_main {
  width: 576px;
  height: calc(100vh - 522px);
  overflow-y: auto;
  position: relative;

  .option_icon {
    position: absolute;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    top: 157.5px;
    transform: translateY(-50%);
    width: 64px;
    height: 64px;
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    color: rgb(255, 255, 255, 0.9);
    font-size: 26px;
  }
  .pdf_box {
    position: relative;
    z-index: 9;
  }
  :deep(.pdf_box canvas) {
    width: 100% !important;
    height: fit-content !important;
  }
  .option_left {
    left: 24px;
  }
  .option_right {
    right: 24px;
  }
}
:deep(.ant-drawer-content) {
  border-radius: 16px 16px 0px 0px;
}
.full_screen_box {
  padding: 0 320px;
  width: 100%;
  height: 100%;
  position: relative;
  .icon_box {
    cursor: pointer;
    position: fixed;
    right: 16px;
    top: 16px;
  }
  .full_screen_title {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    .title_icon {
      width: 28px;
    }
    .title-text1 {
      margin-left: 8px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.9);
      max-width: 300px;
      overflow: hidden;
    }
  }
  .option_left {
    left: 232px;
  }
  .option_right {
    right: 232px;
  }
  .option_icon {
    position: absolute;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    top: 440px;
    transform: translateY(-50%);
    width: 64px;
    height: 64px;
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    color: rgb(255, 255, 255, 0.9);
    font-size: 26px;
  }
  .player_box {
    width: 1280px;
    height: 720px;
  }
}

:deep(.ant-tabs-nav) {
  height: 44px;
  margin-bottom: 0;
}
:deep(.ant-tabs-nav-wrap) {
  padding-left: 16px;
}
</style>
