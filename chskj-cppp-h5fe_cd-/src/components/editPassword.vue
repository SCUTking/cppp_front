<!--
 * @Date: 2023-05-17 15:31:18
 * @LastEditTime: 2023-08-02 15:18:06
-->
<template>
  <div ref="modalRef">
    <a-modal
      v-model:visible="visible"
      :footer="null"
      :closable="false"
      :maskClosable="false"
      :getContainer="() => $refs.modalRef"
      @cancel="reset"
      centered
    >
      <div class="header">
        <span class="title">修改密码</span>
        <img
          src="@/assets/header/closeBlack.png"
          alt="close"
          class="close_img"
          @click="onClose"
        />
      </div>

      <div class="content">
        <a-input-password
          v-model:value="form.oldPassword"
          placeholder="请输入原密码"
        >
          <template #prefix>
            <img src="@/assets/header/lock.png" alt="lock" class="lock_img" />
          </template>
        </a-input-password>

        <a-input-password
          v-model:value="form.newPassword"
          placeholder="请确认新密码"
        >
          <template #prefix>
            <img src="@/assets/header/lock.png" alt="lock" class="lock_img" />
          </template>
        </a-input-password>

        <div class="btns">
          <a-button
            type="primary"
            html-type="submit"
            :disabled="form.oldPassword === '' || form.newPassword === ''"
            @click="onConfirm"
            >保存修改</a-button
          >
          <a-button type="ghost" @click="onClose">暂不修改</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue';
import { useUserStore } from '@/store';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore();

const visible = ref(false),
  form = ref({ oldPassword: '', newPassword: '' }),
  onOpen = () => {
    visible.value = true;
  },
  onClose = () => {
    visible.value = false;
    form.value = { oldPassword: '', newPassword: '' };
  },
  onConfirm = () => {
    proxy.$api.changePassWord({ ...form.value }).then((res) => {
      if (res.resultCode == 200) {
        proxy.$message.info('修改密码成功!');
        proxy.$router.push('/user/login');
        userStore.s_set_token('');
        userStore.s_set_user_info({});
      }
    });
  };

defineExpose({ onOpen });
</script>

<style lang="less" scoped>
:deep(.ant-modal) {
  width: 432px !important;
  height: fit-content;
  background: #ffffff;
  border-radius: 8px;
  padding: 0;

  .ant-modal-content {
    width: 100%;
    height: 100%;
    box-shadow: unset;
    border-radius: 8px;

    .ant-modal-body {
      width: 100%;
      height: 100%;
      padding: 0;

      .header {
        width: 100%;
        height: fit-content;
        box-shadow: inset 0px -1px 0px 0px #e7e7e7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 24px 10px 24px;
        box-sizing: border-box;

        .title {
          height: 28px;
          font-size: 16px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.9);
          line-height: 28px;
        }

        .close_img {
          width: 28px;
          height: 28px;
          cursor: pointer;
        }
      }

      .content {
        width: 100%;
        height: 240px;
        padding: 24px 24px 40px 24px;
        box-sizing: border-box;

        .ant-input-affix-wrapper {
          padding: 10px 16px;
          box-sizing: border-box;

          &:nth-of-type(2) {
            margin-top: 16px;
          }

          .ant-input-prefix {
            width: 28px;
            height: 28px;
            margin-right: 16px;

            .lock_img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .btns {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;

          .ant-btn {
            width: 184px;
            height: 40px;
            border-radius: 3px;
          }
        }
      }
    }
  }
}
</style>
