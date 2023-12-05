<!--
 * @Date: 2023-06-16 09:57:20
 * @LastEditTime: 2023-06-16 11:08:36
-->
<template>
  <Teleport to="body">
    <div class="modal_box" ref="ref">
      <a-modal
        :visible="visible"
        :footer="null"
        :closable="false"
        :getContainer="() => $refs.ref"
      >
        <div class="close_btn" @click="visible = false">
          <img
            src="@/assets/learn/closeBlack.png"
            alt="icon"
            class="close_icon"
          />
        </div>
        <img :src="props.src" alt="插图" />
      </a-modal>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const props = defineProps({ src: String, default: () => '' });

const visible = ref(false),
  open = () => {
    visible.value = true;
  };
defineExpose({ open });
</script>

<style lang="less" scoped>
:deep(.ant-modal) {
  width: 100vw !important;
  height: 100vh;
  max-width: unset;
  top: 0;
  padding: 0;

  .ant-modal-content {
    width: 100%;
    height: 100%;
    background-color: transparent;
    padding-top: 24px;

    .ant-modal-body {
      padding: 0;
      display: flex;
      justify-content: center;

      img {
        max-height: 541px;
        border: 4px solid #ffffff;
      }

      .close_btn {
        width: 42px;
        height: 42px;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: 24px;
        top: 24px;

        .close_icon {
          width: 28px;
          height: 28px;
        }
      }
    }
  }
}
</style>
