<template>
  <div class="drawer" ref="drawerRef">
    <a-drawer
      v-model:visible="visible"
      placement="right"
      :mask="false"
      :closable="false"
      :maskClosable="false"
      :destroyOnClose="true"
      :getContainer="() => drawerRef"
      :class="{ hiddenDrawer: !visible }"
    >
      <div class="drawer_box">
        <div class="top_box">
          <div class="tabs">
            <div
              :class="['tab', { active_tab: activeTab == 0 }]"
              @click="clickTab(0)"
            >
              提问
            </div>
            <div
              :class="['tab', { active_tab: activeTab == 1 }]"
              @click="clickTab(1)"
            >
              讨论
            </div>
          </div>
          <img
            class="close_img"
            src="@/assets/learn/close.png"
            @click="onClose"
          />
        </div>

        <div class="msg_box" @scroll="scrollEvent" ref="msgBoxRef">
          <div class="navbar_box" v-if="commentId">
            <div class="navbar" @click="goBack">
              <img
                src="@/assets/learn/icon_arrowRight.png"
                alt="arrow"
                class="arrow"
              />
              <span>提问详情</span>
            </div>
          </div>
          <div :class="['content_box', commentId ? 'content_detail_box' : '']">
            <div
              class="msg"
              v-for="item in activeTab == 0 ? msgArr : discussArr"
              :key="item.id"
            >
              <img :src="item.userImageUrl" alt="avatar" class="avatar" />
              <div class="content">
                <div class="top">
                  <p class="name">{{ item.userName }}</p>
                  <p class="create_time">{{ formatTime(item.publishTime) }}</p>
                </div>
                <div class="text" v-html="renderHtml(item)"></div>
                <div
                  class="teacher"
                  v-if="activeTab == 0 && item.replyNumber > 0"
                  @click="getReplyList(item)"
                >
                  <p class="teacher_name">
                    {{ item.teacherNameToReplyComment }}
                  </p>
                  <p class="num">{{ item.replyNumber }}条回复</p>
                  <p class="last_reply">
                    最后回复于 {{ formatTime(item.lastReplyTime) }}
                  </p>
                  <img
                    src="@/assets/learn/arrowRight.png"
                    class="arrow_right"
                  />
                </div>
              </div>
            </div>
          </div>
          <ImageViewer :src="imageViewerSrc" ref="ImageViewerRef" />
        </div>

        <div class="input_box">
          <Editor
            @send="onSend"
            ref="editorRef"
            :isAllowedSend="isAllowedSend"
            :activeTab="activeTab"
          />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watchEffect,
  render,
  watch,
  computed,
} from 'vue';
import { useRoute } from 'vue-router';
import { ImageViewer, Editor } from '@/components';
import { useCommonStore, useUserStore, useSseStore } from '@/store';
import { formatTime, copyText } from '@/utils';

const { proxy } = getCurrentInstance(),
  router = useRoute(),
  userStore = useUserStore(),
  sseStore = useSseStore();

const chapterId = ref('');
onMounted(() => {
  chapterId.value = router.query.chapterId;
});

// 抽屉打开
let drawer;
const drawerRef = ref(),
  visible = ref(false),
  open = () => {
    visible.value = true;
  },
  onClose = () => {
    visible.value = false;
    resetIdInfo();
  };
defineExpose({ open });

/**
 * 内容区开始
 */
const emits = defineEmits(['handleVisible']),
  // 当前选中tabId
  activeTab = ref(0),
  // 选中tabId
  clickTab = (tabId) => {
    activeTab.value = tabId;
    editorRef.value.clear();
  },
  // 获取提问列表数据
  getCommentList = () => {
    return new Promise((resolve) => {
      msgArr.length = 0;
      proxy.$api
        .getCommentList({ chapterId: chapterId.value })
        .then((res) => {
          if (res.resultCode == 200) {
            res.data.forEach((item) => {
              msgArr.push(item);
            });
          }
        })
        .finally(() => {
          resolve();
        });
    });
  },
  // 获取评论列表数据
  getDiscussionComment = () => {
    return new Promise((resolve) => {
      msgArr.length = 0;
      proxy.$api
        .getDiscussionComment({ chapterId: chapterId.value })
        .then((res) => {
          if (res.resultCode == 200) {
            res.data.forEach((item) => {
              msgArr.push(item);
            });
          }
        })
        .finally(() => {
          resolve();
        });
    });
  },
  // 渲染html
  renderHtml = (item) => {
    const { contentText } = item;

    // 在所有 <pre> 前添加自定义 <div>
    const modifiedContent = contentText.replace(
      /(<pre>)/g,
      `<div class="top_text_copy">
        <div class="copy">复制</div>
      </div><pre>`
    );

    return modifiedContent;
  },
  // 返回提问列表
  goBack = () => {
    resetIdInfo();
    getCommentList().then(() => {
      scrollAction();
    });
  },
  // 评论详情列表评论id
  commentId = ref(''),
  // 评论详情列表回复数量
  // replyNumber = ref(0),
  detailUserId = ref(''),
  // 获取提问详情列表
  getReplyList = ({ id, userId }) => {
    detailUserId.value = userId;
    commentId.value = id;
    return new Promise((resolve) => {
      proxy.$api.getReplyList({ commentId: id }).then((res) => {
        msgArr.length = 0;
        if (res.resultCode == 200) {
          res.data.forEach((item) => {
            msgArr.push(item);
          });
        }
        resolve();
      });
    });
  };

const resetIdInfo = () => {
  commentId.value = '';
  detailUserId.value = '';
};

watchEffect(() => {
  // 与父组件通信
  emits('handleVisible', visible.value);
  // 抽屉打开时判断是提问还是讨论
  if (visible.value) {
    if (activeTab.value == 0)
      getCommentList().then((res) => {
        scrollAction();
      });
    else {
      resetIdInfo();
      sseStore.isConnected ? change() : sse();
    }
  }
});

// 信息列表
const msgArr = reactive([]),
  // viewer组件的图片地址
  imageViewerSrc = ref('');

const // 是否触底
  isReachBottom = ref(false),
  // 滚动事件
  scrollEvent = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    //触底判断
    isReachBottom.value = scrollTop + clientHeight == scrollHeight;
  },
  // 滚动
  scrollTo = (dom, top) => {
    dom.scrollTo({ top, behavior: 'smooth' });
  },
  // 自动化滚动页面并添加图片点击事件
  scrollAction = () => {
    // 滚动到底部
    if (proxy.$refs?.msgBoxRef)
      scrollTo(proxy.$refs.msgBoxRef, proxy.$refs.msgBoxRef.scrollHeight);

    // 图片点击
    Array.from(document.querySelectorAll('.text img')).forEach((dom) => {
      dom.style.cursor = 'pointer';
      dom.addEventListener('click', () => {
        imageViewerSrc.value = dom.src;
        proxy.$refs.ImageViewerRef.open();
      });
    });

    // 代码块点击
    Array.from(document.querySelectorAll('.copy')).forEach((dom) => {
      dom.addEventListener('click', () => {
        copyText(dom.parentNode.nextSibling.children[0].innerText).then(() => {
          const img = document.createElement('img');
          img.src = require('@/assets/learn/check-circle.png');
          img.className = 'copy_img';
          dom.parentNode.insertBefore(img, dom);
          dom.innerText = '已复制';
          setTimeout(() => {
            dom.parentNode.removeChild(dom.previousSibling);
            dom.innerText = '复制';
          }, 5000);
        });
      });
    });
  };

const isAllowedSend = computed(() => {
  let res = true;
  if (
    commentId.value &&
    activeTab.value == 0 &&
    detailUserId.value != userStore.userInfo.stuId
  )
    res = false;
  return res;
});

const // 编辑器
  editorRef = ref(null),
  // 发送提问/讨论
  onSend = (e) => {
    // 讨论区使用聊天室接口
    if (activeTab.value == 1) sendMessage(e);
    else {
      // 不是自己发布的提问不能评论
      if (!isAllowedSend.value) return;

      const { stuId: userId, stuName: userName, avatar } = userStore.userInfo;
      const params = {
        chapterId: chapterId.value,
        replyTo: commentId.value ? commentId.value : chapterId.value,
        contentText: e,
        userImageUrl:
          avatar ?? 'https://cdn.codedancing.cn/cover/defaultAvatar.png',
        userId,
        userName,
      };

      const apiMap = { 0: 'addComment', 1: 'addDiscussionComment' };
      proxy.$api[apiMap[activeTab.value]](params).then((res) => {
        if (res.resultCode == 200) {
          editorRef.value.clear();
          proxy.$message.info('发送成功！');
          if (commentId.value)
            getReplyList({
              id: commentId.value,
              userId: detailUserId.value,
            }).then(() => {
              scrollAction();
            });
          else
            getCommentList().then((res) => {
              scrollAction();
            });
        }
      });
    }
  };
/**
 * 内容区结束
 */

/**
 * sse
 */
const discussArr = computed(() => {
    nextTick(() => {
      scrollAction();
    });
    return sseStore.arr;
  }),
  // 连接sse
  sse = () => {
    sseStore.s_sse_connect(chapterId.value);
  },
  // 切换课次时调用
  change = () => {
    sseStore.s_sse_change(chapterId.value);
  },
  // 发送信息
  sendMessage = (e) => {
    sseStore.s_sse_message(1, e).then((res) => {
      if (res) editorRef.value.clear();
    });
  };
</script>

<style lang="less" scoped>
:deep(.ant-drawer) {
  width: 480px !important;
  height: calc(100vh - 64px - 56px);
  top: 120px;

  &.hiddenDrawer {
    z-index: -1;
  }

  .ant-drawer-body {
    height: 100%;
    padding: 0;

    .drawer_box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .top_box {
        width: 100%;
        height: 48px;
        background: #ffffff;
        box-shadow: 0px 1px 0px 0px #e7e7e7;
        padding: 0 16px 0 24px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .tabs {
          width: fit-content;
          height: 100%;
          display: flex;
          align-items: center;

          .tab {
            width: 64px;
            height: 100%;
            line-height: 44px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;

            &.active_tab {
              color: #266fe8;
              position: relative;

              &::after {
                width: 24px;
                height: 4px;
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-12px);
                background: #266fe8;
                border-radius: 2px;
              }
            }
          }

          .tab + .tab {
            margin-left: 24px;
          }
        }

        .close_img {
          width: 28px;
          height: 28px;
          cursor: pointer;
        }
      }

      .msg_box {
        width: 100%;
        flex: 1;
        overflow-y: auto;
        position: relative;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.26);
          border-radius: 4px;
        }

        .navbar_box {
          width: 100%;
          height: 48px;
          background: #f3f3f3;
          border: 1px solid #e7e7e7;
          padding: 10px 16px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          position: fixed;

          .navbar {
            width: fit-content;
            height: fit-content;
            cursor: pointer;

            .arrow {
              width: 28px;
              height: 28px;
              transform: rotate(180deg);
            }

            span {
              margin-left: 4px;
              font-size: 14px;
              color: #3d3d3d;
              line-height: 22px;
            }
          }
        }

        .content_box,
        .content_detail_box {
          &.content_detail_box {
            padding-top: 48px;
          }

          .msg {
            width: 100%;
            height: fit-content;
            padding: 16px;
            box-sizing: border-box;
            display: flex;

            &:hover {
              background: #ecf2fe;
            }

            .avatar {
              width: 36px;
              height: 36px;
              border-radius: 50%;
            }

            .content {
              flex: 1;
              width: 0;
              height: fit-content;
              margin-left: 13px;

              .top {
                width: 100%;
                height: 22px;
                display: flex;
                align-items: center;

                .name {
                  height: 100%;
                  font-size: 14px;
                  font-weight: 600;
                  color: rgba(0, 0, 0, 0.9);
                  line-height: 22px;
                }

                .create_time {
                  height: 100%;
                  font-size: 14px;
                  color: rgba(0, 0, 0, 0.6);
                  line-height: 22px;
                  margin-left: 11px;
                }
              }

              .text {
                width: 100%;
                height: fit-content;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.9);
                line-height: 28px;
                margin-top: 8px;

                img {
                  max-width: 100%;
                }

                .top_text_copy {
                  width: 100%;
                  height: 36px;
                  background: #1c1917;
                  border-radius: 8px 8px 0 0;
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  padding: 7px 16px 7px 8px;
                  box-sizing: border-box;

                  .copy_img {
                    width: 14px;
                    height: 14px;
                    margin-right: 4px;
                  }

                  .copy {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 20px;
                    cursor: pointer;
                  }
                }

                pre {
                  background: #282c34;
                  color: rgba(255, 255, 255, 0.55);
                  padding: 5px 8px;
                  box-sizing: border-box;
                  border-radius: 0 0 8px 8px;
                }
              }

              .teacher {
                width: fit-content;
                height: 36px;
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #e7e7e7;
                padding: 4px 13px 4px 19px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                line-height: 28px;
                margin-top: 8px;
                cursor: pointer;

                .teacher_name {
                  height: 100%;
                  font-size: 12px;
                  color: rgba(0, 0, 0, 0.9);
                }

                .num {
                  height: 100%;
                  font-size: 12px;
                  color: #0052d9;
                  margin-left: 8px;
                }

                .last_reply {
                  height: 100%;
                  font-size: 12px;
                  color: rgba(0, 0, 0, 0.6);
                  margin-left: 8px;
                }

                .arrow_right {
                  width: 16px;
                  height: 16px;
                  margin-left: 8px;
                }
              }
            }
          }
        }
      }

      .input_box {
        width: 100%;
        height: 168px;
        background: #ffffff;
        box-shadow: 0px -1px 0px 0px #dcdcdc;
        padding: 0 16px;
        box-sizing: border-box;
      }
    }
  }
}

.code_block_box {
  .top_text_copy {
    width: 100%;
    height: 36px;
    background: #1c1917;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 16px 7px 8px;
    box-sizing: border-box;

    .language {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 22px;
    }
    .copy {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 20px;
      cursor: pointer;
    }
  }

  .bottom_code {
    width: 100%;
    height: fit-content;
    background: #282c34;
    border-radius: 0 0 8px 8px;
    color: rgba(255, 255, 255, 0.55);
    padding: 5px 8px;
    box-sizing: border-box;
  }
}
</style>
