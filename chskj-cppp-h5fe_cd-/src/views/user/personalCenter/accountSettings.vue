<template>
  <div class="account_settings">
    <p class="title">个人信息</p>

    <div class="table">
      <div class="row">
        <span class="label">手机号码:</span>
        <div class="value">
          <span class="phone">{{ userInfo.phone }}</span>
          <span class="change_phone" @click="modalRef.onOpen(0)">更换手机</span>
          <span class="change_pass" @click="passwordRef.onOpen()"
            >修改密码</span
          >

          <editPassword ref="passwordRef" />
        </div>
      </div>

      <span class="tips">
        * 学习记录以当前登录帐号为准，可使用该手机号直接登录当前帐户
      </span>

      <div class="row">
        <span class="label">电子邮箱:</span>
        <div class="value">
          <span class="email" v-if="userInfo.email">{{ userInfo.email }}</span>
          <span
            :class="['change_email', { init_change_email: !userInfo.email }]"
            @click="modalRef.onOpen(1)"
            >{{ userInfo.email ? '更换邮箱' : '点击绑定' }}</span
          >
        </div>
      </div>

      <div class="row">
        <span class="label">绑定微信:</span>
        <div class="value">
          <span class="wx" v-if="userInfo.wx">{{ userInfo.wxNickname }}</span>
          <span
            :class="['change_wx', { init_change_wx: !userInfo.wx }]"
            @click="!userInfo.wx ? modalRef.onOpen(2) : unbindWx()"
            >{{ userInfo.wx ? '解除绑定' : '点击绑定' }}</span
          >
        </div>
      </div>

      <ActionModal ref="modalRef" @success="emits('onGetUserInfo')" />
    </div>
  </div>
</template>

<script setup>
import { useCommonStore, useUserStore } from '@/store';
import { ref, reactive, getCurrentInstance, computed } from 'vue';
import ActionModal from './accountSettingsModal.vue';
import editPassword from '@/components/editPassword.vue';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

commonStore.s_set_breadcrumb([
  { label: '个人中心' },
  { label: '账号安全' },
  { label: '账号设置' },
]);

const emits = defineEmits(['onGetUserInfo']);

const userInfo = computed(() => {
  return userStore.userInfo;
});

const passwordRef = ref(null),
  modalRef = ref(null);

const unbindWx = () => {
  proxy.$modal.confirm({
    title: '警告',
    content: '确定解除绑定？',
    onOk() {
      proxy.$api.unbindWx().then((res) => {
        if (res.resultCode == 200) {
          proxy.$message.info(res.resultMsg);
          emits('onGetUserInfo');
        }
      });
    },
  });
};
</script>

<style lang="less" scoped>
.account_settings {
  width: 100%;
  height: 674px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 0 151px 32px;
  box-sizing: border-box;

  .title {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    line-height: 28px;
  }

  .table {
    width: 100%;
    height: fit-content;
    margin-top: 36px;
    padding: 0 0 0 57px;
    box-sizing: border-box;

    .row {
      width: 100%;
      height: fit-content;
      display: flex;
      align-items: center;

      &:not(:first-of-type) {
        margin-top: 26px;
      }

      .label {
        min-width: 71px;
        color: rgba(0, 0, 0, 0.4);
        display: inline-block;
        height: 22px;
        font-size: 14px;
        line-height: 22px;
        flex-shrink: 0;
      }

      .value {
        width: 100%;
        height: fit-content;
        margin-left: 16px;

        .phone {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.9);
          line-height: 22px;
        }

        .change_phone,
        .change_pass,
        .change_email,
        .change_wx {
          height: 22px;
          font-size: 14px;
          color: #0052d9;
          line-height: 22px;
          margin-left: 40px;
          cursor: pointer;

          &.init_change_email,
          &.change_wx {
            margin-left: 16px;
          }
        }
      }
    }

    .tips {
      height: 20px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
      line-height: 20px;
      display: inline-block;
      margin-left: 87px;
      margin-top: 13px;
    }
  }
}
</style>
