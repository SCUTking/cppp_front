<template>
  <div class="forget-modal" ref="forgetRef">
    <a-modal
      v-model:visible="visible"
      :getContainer="() => $refs.forgetRef"
      :destroyOnClose="true"
      :maskClosable="false"
      :closable="false"
      :footer="null"
      :afterClose="afterClose"
    >
      <p class="title">{{ type ? '找回密码' : '账号注册' }}</p>

      <div class="form">
        <a-input
          class="input"
          v-model:value="forgetModal.mobile"
          :maxlength="11"
          placeholder="请输入账号"
        >
          <template #prefix>
            <img src="@/assets/login/account.png" alt class="icon" />
          </template>
        </a-input>

        <div class="code-box">
          <a-input
            class="input"
            v-model:value="forgetModal.code"
            style="width: 65%"
            placeholder="请输入验证码"
          >
            <template #prefix>
              <img src="@/assets/login/code.png" alt class="icon" />
            </template>
          </a-input>
          <a-button class="get-code-btn" @click="getCode" :disabled="isSend">
            {{ isSend ? time + 's' : '获取验证码' }}
          </a-button>
        </div>

        <a-input-password
          class="input"
          @pressEnter="click"
          v-model:value="forgetModal.password"
          :placeholder="type ? '请输入新密码' : '请输入密码'"
        >
          <template #prefix>
            <img src="@/assets/login/pass.png" alt class="icon" />
          </template>
        </a-input-password>

        <a-input-password
          class="input"
          @pressEnter="click"
          v-model:value="forgetModal.rpPassword"
          :placeholder="type ? '请确认新密码' : '请确认密码'"
        >
          <template #prefix>
            <img src="@/assets/login/pass.png" alt class="icon" />
          </template>
        </a-input-password>

        <a-button
          :class="['reset_btn', { register_btn: !type }]"
          :loading="loading"
          @click="handleSubmit"
          type="primary"
          block
        >
          <span>{{ type ? '重置密码' : '确认注册' }}</span>
        </a-button>
        <a-button
          :class="['login_btn', { r_login_btn: !type }]"
          @click="emits('onClose')"
          block
          ghost
        >
          <span>返回登录</span>
        </a-button>
      </div>

      <!-- 版权 -->
      <p class="copyright">{{ copyright }} {{ icp }}</p>
    </a-modal>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, toRef } from 'vue';
import { useCommonStore } from '@/store/index';

const copyright = ref(process.env.VUE_APP_COPYRIGHT),
  icp = ref(process.env.VUE_APP_ICP);

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore();

const props = defineProps({ type: Number }),
  type = toRef(props, 'type');

const isSend = ref(false),
  time = ref(60),
  getCode = () => {
    const { mobile } = forgetModal.value;
    if (!mobile) {
      proxy.$message.error('请输入手机号！');
      return;
    }
    proxy.$api.sendSms({ mobile }).then((res) => {
      if (res && res.resultCode == 200) {
        const { data, code } = res;
        proxy.$message.info('发送成功！');
        isSend.value = true;

        const counter = setInterval(() => {
          time.value--;

          if (time.value == 0) {
            clearInterval(counter);
            isSend.value = false;
            time.value = 60;
          }
        }, 1000);
      }
    });
  };

const visible = ref(false),
  loading = ref(false),
  forgetModal = ref({ mobile: '', code: '', password: '', rpPassword: '' }),
  handleSubmit = () => {
    type.value ? reset() : register();
  },
  register = () => {
    const { mobile, code } = forgetModal.value;
    const params = forgetModal.value;
    params.account = mobile;
    params.checkCode = code;
    delete params.mobile;
    delete params.code;

    loading.value = true;
    proxy.$api
      .register(params)
      .then((res) => {
        if (res.resultCode == 200) {
          proxy.$message.info(res.resultMsg);
          visible.value = false;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  },
  reset = () => {
    const params = forgetModal.value;
    loading.value = true;
    proxy.$api
      .updatePassWord(params)
      .then((res) => {
        if (res.resultCode == 200) {
          proxy.$message.info(res.resultMsg);
          visible.value = false;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
defineExpose({ visible });

const emits = defineEmits(['onClose']);

const afterClose = () => {
  visible.value = false;
  forgetModal.value = {
    mobile: '',
    code: '',
    password: '',
    rpPassword: '',
  };
};
</script>

<style lang="less" scoped>
:deep(.ant-modal-mask) {
  background-color: unset;
}

:deep(.ant-modal) {
  width: 520px !important;
  background: #ffffff;
  box-shadow: 0px 20px 31px 0px rgba(0, 0, 0, 0.16),
    0px 0px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  margin: unset;
  padding: unset;
  left: 1020px;
  top: 160px;

  .ant-modal-content {
    border-radius: 8px;
    background-color: unset;
    box-shadow: unset;

    .ant-modal-body {
      padding: 48px 0 32px 0;

      .title {
        width: 100%;
        height: 36px;
        text-align: center;
        font-size: 24px;
        color: #000000;
        line-height: 36px;
        margin-bottom: 16px;
      }

      .form {
        width: 100%;
        height: fit-content;
        padding: 0 68px;
        box-sizing: border-box;

        .icon {
          width: 28px;
          height: 28px;
        }

        .input {
          height: 48px;
          margin-top: 16px;
        }

        .code-box {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .get-code-btn {
            width: 33%;
            height: 48px;
            background: #699ef5;
            color: #ffffff;
            margin-top: 16px;
          }
        }

        .reset_btn {
          height: 56px;
          background: #0052d9;
          border-radius: 3px;
          margin-top: 24px;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          line-height: 24px;

          &.register_btn {
            background: #2ba471;
            color: rgba(255, 255, 255, 0.9);
          }
        }

        .login_btn {
          height: 56px;
          border-radius: 3px;
          border: 1px solid #0052d9;
          font-size: 16px;
          font-weight: 600;
          color: #0052d9;
          line-height: 24px;
          margin-top: 16px;

          &.r_login_btn {
            color: #2ba471;
            border: 1px solid #2ba471;
          }
        }
      }

      .copyright {
        width: 100%;
        height: fit-content;
        text-align: center;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 20px;
        margin-top: 24px;
      }
    }
  }
}
</style>
