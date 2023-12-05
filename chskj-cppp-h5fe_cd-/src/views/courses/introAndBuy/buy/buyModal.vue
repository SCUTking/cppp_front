<template>
  <div ref="modalRef">
    <a-modal
      v-model:visible="visible"
      :closable="false"
      :destroyOnClose="true"
      :footer="null"
      :maskClosable="false"
      :getContainer="() => $refs.modalRef"
      @cancel="onClose"
    >
      <div class="header">
        <p class="tips">请添加客服微信</p>
        <img
          src="@/assets/course/close.png"
          alt="close"
          class="close_btn"
          @click="onClose"
        />
      </div>
      <img src="@/assets/course/customer_service.png" alt="code" class="code" />
    </a-modal>
  </div>
</template>

<script setup>
import { useCommonStore } from '@/store';
import { ref, reactive, getCurrentInstance, computed } from 'vue';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore();

const visible = computed(() => {
    return commonStore.buyLoading;
  }),
  onClose = () => {
    commonStore.s_set_buyLoading(false);
  };
</script>

<style lang="less" scoped>
:deep(.ant-modal) {
  width: 480px !important;
  height: fit-content !important;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.302);
  padding: 0;

  .ant-modal-content {
    width: 100%;
    height: 100%;
    border-radius: 8px;

    .ant-modal-body {
      width: 100%;
      height: 100%;
      padding: 9px 24px 17px 24px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .header {
        width: 100%;
        height: 56px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        font-size: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .tips {
          color: #3d3d3d;
          line-height: 56px;
        }

        .close_btn {
          width: 28px;
          height: 28px;
          cursor: pointer;
        }
      }

      .code {
        width: 258px;
        height: 258px;
        margin-top: 16px;
      }
    }
  }
}
</style>
