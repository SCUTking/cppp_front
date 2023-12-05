<template>
  <div class="course_content">
    <img src="@/assets/bg.png" alt="bg" class="bg_img" />
    <div class="directory_box">
      <div class="directory_bg">
        <div class="title_box">
          <img
            class="title_icon"
            src="@/assets/personalCenter/nav_studyMan_hover.png"
          />
          <span class="title_text">课程内容</span>
        </div>
        <a-collapse v-model:activeKey="activeKey" expandIconPosition="right">
          <template #expandIcon="{ isActive }">
            <right-outlined
              :rotate="isActive ? -90 : 90"
              :style="
                isActive ? 'font-size:0.1rem;color:#fff' : 'font-size:0.1rem'
              "
            />
          </template>
          <a-collapse-panel
            :key="item.unitId"
            v-for="(item, index) in unitInfoVoList"
            :collapsible="
              item.courseChapterVoList.length == 0 ? 'disabled' : ''
            "
          >
            <template #header>
              <div class="collapse_header">
                <span class="header_icon"></span>
                <span class="header_text">{{ item.unitName }}</span>
              </div>
            </template>
            <div class="collapse_items_box">
              <div
                class="collapse_item"
                v-for="courseChapter in item.courseChapterVoList"
                @click="
                  toLearn(
                    courseChapter.chapterId,
                    courseChapter.chapterType,
                    item.unitId,
                    courseChapter.paperId
                  )
                "
              >
                <span class="collapse_item_text">{{
                  courseChapter.chapterName
                }}</span>
                <span class="collapse_item_icon"></span>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
    <div class="course_content_main">
      <div class="content_box">
        <div class="unit_box" v-for="(item, index) in unitInfoVoList">
          <div
            class="left_box"
            :class="
              item.courseChapterVoList.length > 3 ? 'height420' : 'height1198'
            "
          >
            <div class="left_title">{{ item.unitName }}</div>
            <div class="tags">
              <a-space direction="vertical">
                <a-tag
                  class="tag"
                  v-for="tag in item.myUnitKnowledgeList"
                  :key="tag"
                >
                  {{ tag }}
                </a-tag>
              </a-space>
            </div>
            <img
              v-if="item.unitCover"
              :src="item.unitCover"
              alt=""
              class="unit_bg"
            />
          </div>
          <div class="right_box">
            <div
              class="card_box"
              v-for="(
                courseChapter, courseChapterIndex
              ) in item.courseChapterVoList"
            >
              <img :src="courseChapter.chapterCover" alt class="card_img" />
              <p class="text1" v-if="courseChapter.chapterType == 1">
                第{{ convertToChineseNumeral(courseChapterIndex + 1) }}课
              </p>
              <p class="text1" v-if="courseChapter.chapterType == 2">
                单元测试
              </p>
              <p class="text1" v-if="courseChapter.chapterType == 3">
                课程考试
              </p>
              <p class="text2">{{ courseChapter.chapterName }}</p>
              <a-button
                class="card_button"
                :class="'card_button' + courseChapter.chapterType"
                @click="
                  toLearn(
                    courseChapter.chapterId,
                    courseChapter.chapterType,
                    item.unitId,
                    courseChapter.paperId
                  )
                "
                ><span
                  >立即{{ cardButtonMap[courseChapter.chapterType] }}
                </span>
                <span style="margin-left: 1em">></span></a-button
              >
            </div>
          </div>
        </div>
        <div class="footer">{{ VUE_APP_COPYRIGHT }} {{ VUE_APP_ICP }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import { useCommonStore, useUserStore } from '@/store';
import { convertToChineseNumeral } from '@/utils/';
const { VUE_APP_COPYRIGHT, VUE_APP_ICP } = process.env;

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore(),
  userStore = useUserStore();
const activeKey = ref([]);
const cardButtonMap = {
  1: '学习',
  2: '测试',
  3: '考试',
};

let courseId, ccId;
onMounted(() => {
  courseId = proxy.$route.query.courseId;
  ccId = proxy.$route.query.ccId;
  getCourseInfoWithUnitMessage();
});

const unitInfoVoList = ref([]); // 单元列表

const getCourseInfoWithUnitMessage = async () => {
  const params = {
    stuId: userStore.userInfo.stuId,
    courseId,
    ccId,
  };
  const res = await proxy.$api.getCourseInfoWithUnitMessage(params);
  if (res.resultCode == 200) {
    const { isUserBuy, unitInfoVoList: list, companyInfo } = res.data;
    list.forEach((item) => {
      let mList = [];
      item.unitKnowledgeList?.forEach((knowledgeItem) => {
        mList.push(knowledgeItem.knowledge);
      });
      item.myUnitKnowledgeList = [...new Set(mList)];
    });
    unitInfoVoList.value = list;
    if (!isUserBuy)
      proxy.$router.push({ name: 'intro', query: { courseId, ccId } });
    commonStore.s_set_company_logo(companyInfo?.companyLogo ?? null);
  }
};

const toLearn = (chapterId, chapterType, unitId, paperId) => {
  switch (chapterType) {
    case 1:
      proxy.$router.push({
        path: '/courses/learn',
        query: { chapterId, courseId, ccId, unitId },
      });
      break;
    default:
      if (paperId) {
        proxy.$router.push({
          path: '/courses/reminder',
          query: { courseId, ccId, paperId },
        });
      } else {
        proxy.$message.info('暂无试卷!');
      }
      break;
  }
};
</script>

<style lang="less" scoped>
.course_content {
  padding: 24px;
  position: relative;
  display: flex;
  .bg_img {
    width: 100%;
    height: 866px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .directory_box {
    position: relative;
    z-index: 9;
    width: 364px;
    height: calc(100vh - 112px);
    overflow: auto;
    border-radius: 16px;
    .directory_bg {
      padding: 16px;
      background: rgba(255, 255, 255, 0.65);
    }
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    :deep(.ant-collapse) {
      background: unset;
      border: unset;
      .ant-collapse-item {
        border: unset;
        .ant-collapse-header {
          margin-bottom: 8px;
          background: #00a870;
          border-radius: 8px;
          border: 1px solid transparent;
          .ant-collapse-arrow {
            color: #77d1b3;
          }
          &:hover {
            background: #e8f8f2;
            border: 1px solid #00a870;
            .header_icon {
              background: url('@/assets/classification/icon_folder-hover.png');
              background-size: contain;
            }
            .header_text {
              color: #00a870;
            }
            .ant-collapse-arrow {
              color: #00a870 !important;
            }
          }
          .collapse_header {
            display: flex;
            align-items: center;
          }
          .header_icon {
            width: 28px;
            height: 28px;
            background: url('@/assets/classification/icon_folder.png');
            background-size: contain;
          }
          .header_text {
            font-size: 20px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            line-height: 28px;
          }
        }
      }
      .ant-collapse-content {
        border-top: unset;
        background-color: unset;
      }
      .ant-collapse-content-box {
        padding: 8px;
        margin-bottom: 8px;
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #e7e7e7;

        .collapse_items_box {
          .collapse_item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 8px 10px 18px;
            box-shadow: inset 0px -1px 0px 0px #e7e7e7;
            .collapse_item_text {
              font-size: 16px;
              font-weight: 600;
              color: #0052d9;
              line-height: 24px;
            }
            .collapse_item_icon {
              width: 28px;
              height: 28px;
              background: url('@/assets/classification/icon_rirht.png');
              background-size: contain;
            }
            &:hover {
              background: #ecf2fe;
              .collapse_item_icon {
                background: url('@/assets/classification/icon_rirht-hover.png');
                background-size: contain;
              }
            }
            &:nth-last-of-type(1) {
              box-shadow: unset;
            }
          }
        }
      }
    }
    .title_box {
      margin-bottom: 16px;
      padding: 8px 15px;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 8px;
      .title_icon {
        margin-right: 8px;
        width: 28px;
      }
      .title_text {
        font-size: 16px;
        font-weight: 600;
        color: #2ba471;
      }
    }
  }
  .course_content_main {
    flex: 1;
    position: relative;
    height: calc(100vh - 112px);
    overflow: scroll;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .content_box {
      position: relative;
      padding: 0 32px 28px 48px;
      .unit_box {
        padding: 48px 0 24px 0;
        display: flex;
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.15);
        &:nth-of-type(1) {
          padding-top: 24px;
        }
        &:nth-last-of-type(2) {
          box-shadow: unset;
        }
        .height420 {
          height: 420px;
        }
        .height1198 {
          height: 198px;
        }
        .left_box {
          margin-right: 24px;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          width: 300px;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.26);
          box-sizing: border-box;
          position: relative;
          z-index: 10;
          background: #fff;

          .left_title {
            margin-bottom: 24px;
            font-size: 36px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
            line-height: 44px;
            position: relative;
            z-index: 10;
          }
          .tags {
            height: 100%;
            // width: 300px;
            overflow: hidden;
            position: relative;
            z-index: 10;
            :deep(.ant-space) {
              gap: 8px !important;
            }
            .ant-space-vertical {
              flex-direction: row;
              flex-wrap: wrap;
              .tag {
                margin-right: 0;
                padding: 4px 16px;
                box-sizing: border-box;
                border: 1px solid #85dbbe;
                background: #e8f8f2;
                border-radius: 14px;
                font-size: 12px;
                font-weight: 600;
                color: #00a870;
                line-height: 20px;
              }
            }
          }
          .unit_bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 16px;
            z-index: 9;
          }
        }
        .right_box {
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          align-content: baseline;
          // justify-content: space-between;
          .card_box {
            width: 352px;
            padding: 24px 16px 56px 24px;
            position: relative;
            margin-bottom: 24px;
            margin-right: 24px;
            border-radius: 8px;
            overflow: hidden;
            height: fit-content;
            &:nth-of-type(3n) {
              margin-right: 0;
            }
            .card_img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 9;
            }
            .text1 {
              margin-bottom: 8px;
              position: relative;
              z-index: 10;
              font-size: 14px;
              font-weight: 600;
              color: rgba(255, 255, 255, 0.9);
              line-height: 22px;
            }
            .text2 {
              position: relative;
              min-height: 88px;
              z-index: 10;
              font-size: 28px;
              font-weight: 600;
              color: #ffffff;
              line-height: 36px;
            }
            .card_button {
              z-index: 10;
              position: absolute;
              right: 24px;
              width: 142px;
              height: 40px;
              background: #f2f3ff;
              border-radius: 20px;
              border: 1px solid #0052d9;
              font-size: 16px;
              color: #0052d9;
            }
            .card_button2 {
              background: #2ba471;
              border: 1px solid #ffffff;
              color: #ffffff;
            }
            .card_button3 {
              background: #f6685d;
              border: 1px solid #ffffff;
              color: #ffffff;
            }
          }
        }
      }
      .footer {
        position: absolute;
        left: -388px;
        height: -80px;
        width: 100vw;
        height: 80px;
        // background: #ffffff;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 80px;
        text-align: center;
      }
    }
  }
}
</style>
