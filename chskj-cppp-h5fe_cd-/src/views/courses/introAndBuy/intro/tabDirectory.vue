<template>
  <div class="toc">
    <a-collapse
      v-model:activeKey="activeKey"
      expandIconPosition="right"
      v-if="unitInfoVo?.length"
    >
      <template #expandIcon="{ isActive }">
        <right-outlined :rotate="isActive ? -90 : 90" />
      </template>
      <a-collapse-panel
        :key="item.unitId"
        v-for="(item, index) in unitInfoVo"
        :collapsible="item.courseChapterVoList.length == 0 ? 'disabled' : ''"
      >
        <template #header>
          <div class="collapse_header">
            <img
              :src="handleHeader(unitInfoVo[index])"
              alt="player"
              class="header_icon"
            />
            <span class="header_text">{{ item.unitName }}</span>
          </div>
        </template>
        <div class="collapse_items_box">
          <div
            class="collapse_item"
            :collapsible="
              item.courseChapterVoList.length == 0 ? 'disabled' : ''
            "
            v-for="(chapter, index) in item.courseChapterVoList"
            @click="onClickChapter(chapter)"
          >
            <div class="course">
              <img
                :src="handleClassify(chapter, index).chapterIcon"
                alt="chapter"
                class="play_icon"
              />
              <div class="chapter_info_box">
                <p class="no">{{ handleClassify(chapter, index).noText }}</p>
                <span class="collapse_item_text">{{
                  chapter.chapterName
                }}</span>
                <a-button>
                  <img
                    :src="handleClassify(chapter).btnIcon"
                    alt="btn"
                    class="btn_icon"
                  />
                  <span>{{ handleClassify(chapter).btnText }}</span>
                </a-button>
              </div>
            </div>
            <img
              src="@/assets/course/lock.png"
              alt="lock"
              class="lock_icon"
              v-if="!isUserBuy"
            />
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <a-empty description="暂无数据" v-else />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  toRef,
  computed,
} from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import { convertToChineseNumeral } from '@/utils';

const { proxy } = getCurrentInstance();

const props = defineProps({ unitInfoVo: Object, isUserBuy: Boolean }),
  unitInfoVo = toRef(props, 'unitInfoVo'),
  isUserBuy = toRef(props.isUserBuy);

const activeKey = ref([]),
  handleHeader = (item) => {
    const { unitType } = item;
    const icon = unitType
      ? require('@/assets/course/unit_exam.png')
      : require('@/assets/course/unit_course.png');
    return icon;
  },
  handleClassify = (chapter, index) => {
    const { chapterType } = chapter;
    let btnText, noText, chapterIcon, btnIcon;
    if (chapterType == 1) {
      btnText = '学习课次';
      noText = `第${convertToChineseNumeral(index + 1)}课`;
      chapterIcon = require('@/assets/course/chapter.png');
      btnIcon = require('@/assets/course/btn_course.png');
    }
    if (chapterType == 2) {
      btnText = '测试课次';
      noText = '单元测试';
      chapterIcon = require('@/assets/course/course_test.png');
      btnIcon = require('@/assets/course/btn_test.png');
    }
    if (chapterType == 3) {
      btnText = '考试课次';
      noText = '课程考试';
      chapterIcon = require('@/assets/course/course_test.png');
      btnIcon = require('@/assets/course/btn_exam.png');
    }
    return { btnText, noText, chapterIcon, btnIcon };
  },
  onClickChapter = (chapter) => {
    if (isUserBuy.value) {
      const { chapterId, courseId, ccId, unitId, chapterType } = chapter;
      let name = 'learn',
        query = { chapterId, courseId, ccId };
      console.log(chapterType, query, name);
      if (chapterType > 1) {
        name = 'reminder';
        query.chapterType = chapterType;
      } else query.unitId = unitId;

      proxy.$router.push({ name, query });
    } else proxy.$message.info('购买后可解锁全部内容');
  };
</script>

<style lang="less" scoped>
.toc {
  padding: 0 24px 24px 24px;

  :deep(.ant-collapse) {
    background: unset;
    border: unset;

    .ant-collapse-item {
      border: unset;

      &:not(:first-of-type) {
        margin-top: 16px;
      }

      .ant-collapse-header {
        width: 100%;
        height: 56px;
        background: #f3f3f3;
        border-radius: 8px;
        padding: 14px 24px;
        box-sizing: border-box;

        .collapse_header {
          display: flex;
          align-items: center;

          .header_icon {
            width: 28px;
            height: 28px;
          }

          .header_text {
            height: 28px;
            font-size: 20px;
            font-weight: 600;
            color: rgba(61, 61, 61, 0.6);
            line-height: 28px;
            margin-left: 8px;
          }
        }
      }

      .ant-collapse-content {
        border: unset;

        .ant-collapse-content-box {
          padding: 0;

          .collapse_item {
            width: 100%;
            height: 104px;
            padding: 16px 24px 24px 22px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            position: relative;

            &:hover {
              background: rgba(#f3f3f3, 0.5);
              cursor: pointer;
            }

            &::after {
              position: absolute;
              bottom: 0;
              left: 60px;
              width: calc(100% - 60px);
              height: 1px;
              background: #e7e7e7;
              content: '';
            }

            .course {
              width: 100%;
              height: fit-content;
              display: flex;

              .chapter_info_box {
                margin-left: 10px;
                margin-top: 3px;

                .no {
                  margin-bottom: 11px;
                }

                .collapse_item_text {
                  height: 28px;
                  font-size: 20px;
                  font-weight: 600;
                  color: rgba(0, 0, 0, 0.9);
                  line-height: 28px;
                  margin-top: 11px;
                }

                .ant-btn {
                  background: #f2f3ff;
                  border-radius: 100px;
                  border: 1px solid #0052d9;
                  font-size: 12px;
                  color: #0052d9;
                  line-height: 20px;
                  padding: 4px 16px;
                  margin-left: 24px;
                  display: inline-flex;
                  align-items: center;

                  .btn_icon {
                    width: 14px;
                    height: 14px;
                    margin-right: 4px;
                  }
                }
              }
            }

            .play_icon,
            .lock_icon {
              width: 28px;
              height: 28px;
            }
          }
        }
      }
    }
  }
}
</style>
