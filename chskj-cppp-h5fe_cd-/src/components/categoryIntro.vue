<template>
  <div class="drawer_box" ref="drawerRef">
    <a-drawer
      placement="bottom"
      v-model:visible="visible"
      :closable="false"
      :destroyOnClose="true"
      :getContainer="() => $refs.drawerRef"
    >
      <div class="box">
        <div class="close_btn" @click="visible = false">
          <img
            src="@/assets/classification/closeBlack.png"
            alt="close"
            class="close"
          />
        </div>
      </div>
      <div class="content">
        <div class="content_header">
          <div class="content_logo_box">
            <img :src="content.ccIcon" alt="ccIcon" class="logo" />
          </div>
          <div class="content_name_num_box">
            <p class="name">{{ content.ccName }}</p>
            <p class="num">共 {{ content.courseInfoVoList.length }} 门课程</p>
          </div>
        </div>
        <div class="content_desc" v-html="content.ccDescribe"></div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false),
  content = ref();

defineExpose({ visible, content });
</script>

<style lang="less" scoped>
.drawer_box {
  width: 100%;
  height: fit-content;

  :deep(.ant-drawer) {
    width: 100%;

    .ant-drawer-content-wrapper {
      height: 100% !important;
      border-radius: 16px 16px 0 0;
      box-shadow: unset;
      margin-top: 56px;

      .ant-drawer-content {
        background: unset;

        .ant-drawer-body {
          width: 100%;
          height: fit-content;
          padding: 0;
          box-sizing: border-box;
          display: flex;
          flex-flow: column;
          justify-content: flex-end;

          .box {
            width: 100%;
            height: 72px;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-end;

            .close_btn {
              width: 40px;
              height: 40px;
              background: #f3f3f3;
              padding: 6px;
              box-sizing: border-box;
              border-radius: 50%;
              cursor: pointer;

              .close {
                width: 28px;
                height: 28px;
              }
            }
          }

          .content {
            width: 100%;
            height: fit-content;
            background: #ffffff;
            padding: 48px 560px 0 560px;
            border-radius: 16px;
            overflow-y: auto;

            &::-webkit-scrollbar {
              width: 0;
            }

            .content_header {
              width: 100%;
              height: 96px;
              display: flex;
              align-items: center;

              .content_logo_box {
                width: 96px;
                height: 100%;
                background: #ffffff;
                border-radius: 24px 24px 24px 24px;
                border: 1px solid #dcdcdc;
                display: flex;
                align-items: center;
                justify-content: center;

                .logo {
                  width: 80px;
                  height: 80px;
                }
              }

              .content_name_num_box {
                width: fit-content;
                height: 100%;
                margin-left: 16px;
                color: #3d3d3d;
                font-weight: 600;
                padding: 8px 0;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .name {
                  height: 44px;
                  font-size: 36px;
                  line-height: 44px;
                }

                .num {
                  height: 28px;
                  font-size: 16px;
                  line-height: 28px;
                }
              }
            }

            .content_desc {
              width: 100%;
              height: fit-content;
              margin-top: 16px;

              img {
                max-width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
