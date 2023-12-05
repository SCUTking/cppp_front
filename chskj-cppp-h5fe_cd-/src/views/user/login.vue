<!--
 * @Date: 2023-04-19 16:18:21
 * @LastEditTime: 2023-08-02 14:45:19
-->
<template>
  <div :class="['login', { login_modal: isOpenModal }]" ref="loginRef">
    <img src="@/assets/bg.png" alt="" class="bg" />
    <!-- 插画 -->
    <img
      src="@/assets/login/illustration.png"
      alt="illustration"
      class="illustration"
    />
    <!-- 登录 -->
    <div class="login-box">
      <p class="title" v-html="app_title.replace(' ', '<br />')"></p>
<!--      <p class="title" v-html="app_title.replace(' ', '<br />')"></p>-->

      <!-- 表单 -->
      <div class="login-form">
        <a-input
          class="input"
          v-model:value="loginData.account"
          @pressEnter="login"
          placeholder="请输入账号"
        >
          <template #prefix>
            <img src="@/assets/login/account.png" alt class="icon" />
          </template>
        </a-input>

        <a-input-password
          class="input"
          @pressEnter="login"
          v-model:value="loginData.password"
          placeholder="请输入登录密码"
        >
          <template #prefix>
            <img src="@/assets/login/pass.png" alt class="icon" />
          </template>
        </a-input-password>

        <div class="code-box">
          <a-input
            class="input"
            style="width: 70%"
            @pressEnter="login"
            v-model:value="loginData.inputCode"
            placeholder="请输入验证码"
          >
            <template #prefix>
              <img src="@/assets/login/code.png" alt class="icon" />
            </template>
          </a-input>

          <img :src="code.img" alt class="code" @click="uuid" />
        </div>

        <a-button
          class="login_btn"
          type="primary"
          :loading="loading"
          block
          @click="login"
        >
          <span>登录</span>
        </a-button>

        <a-button
          class="register_btn"
          type="primary"
          block
          ghost
          @click="onOpen(0)"
        >
          <span>注册</span>
        </a-button>

        <a-button
          class="forget_btn"
          type="primary"
          block
          ghost
          @click="onOpen(1)"
        >
          <span>忘记密码</span>
        </a-button>
      </div>
      <!-- 版权 -->
<!--      <p class="copyright">{{ copyright }} {{ icp }}</p>-->
    </div>

    <!-- 忘记密码/注册 -->
    <ResetPass ref="forgetRef" :type="type" @onClose="onClose" />
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import ResetPass from './resetPass.vue';
import { useCommonStore, useUserStore } from '@/store';

const copyright = ref(process.env.VUE_APP_COPYRIGHT),
  icp = ref(process.env.VUE_APP_ICP),
  app_title = '智慧教育平台';
  // app_title = ref(process.env.VUE_APP_TITLE);

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

onMounted(() => {
  uuid();
  if (commonStore.isRegister) {
    onOpen(0);
    commonStore.s_set_is_register(false);
  }
});

const loginRef = ref(null);
/**
 * 验证码模块
 */
const code = ref({ img: '', uuid: '' });
const uuid = () => {
  proxy.$api.uuid().then((res) => {
    if (res) {
      const { checkImg, uuid } = res.data;
      code.value.img = checkImg;
      code.value.uuid = uuid;
    }
  });
};

/**
 * 登录模块
 */
// 登录表单数据
const loading = ref(false);
const loginData = reactive({ account: '', password: '', inputCode: '' });

// 登录
const login = () => {
  const { account, password, inputCode } = loginData;
  if (!account) proxy.$message.warning('请填写账号', 2);
  else if (!password) proxy.$message.warning('请输入登录密码', 2);
  else if (!inputCode) proxy.$message.warning('请输入验证码', 2);
  else {
    loading.value = true;
    userStore
      .login(account, password, inputCode, code.value.uuid)
      .then((res) => {
        if (!res) {
          loginData.inputCode = '';
          uuid();
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

/**
 * 忘记密码/注册模块
 */
const forgetRef = ref(null),
  type = ref(0),
  isOpenModal = ref(false),
  onOpen = (num) => {
    type.value = num;
    loginRef.value.scrollTo(0, 0);
    forgetRef.value.visible = true;
    isOpenModal.value = true;
  },
  onClose = () => {
    forgetRef.value.visible = false;
    isOpenModal.value = false;
  };
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background: #ffffff;
  position: relative;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
  }

  .bg {
    width: 100%;
    height: 1080px;
    min-height: 100vh;
  }

  .illustration {
    width: 880px;
    height: 680px;
    position: absolute;
    top: 160px;
    left: 140px;
  }

  .login-box {
    width: 520px;
    height: fit-content;
    background: #ffffff;
    box-shadow: 0px 20px 31px 0px rgba(0, 0, 0, 0.16),
      0px 0px 20px 0px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    padding: 48px 0 36px 0;
    box-sizing: border-box;
    position: absolute;
    top: 160px;
    left: 1020px;

    .title {
      margin-bottom: 36px;
      font-size: 24px;
      color: #000000;
      line-height: 36px;
      text-align: center;
    }

    .login-form {
      width: 100%;
      height: fit-content;
      padding: 0 68px;
      box-sizing: border-box;

      .input {
        margin-bottom: 16px;
        height: 48px;
        background: #ffffff;

        .icon {
          width: 28px;
          height: 28px;
        }
      }

      .code-box {
        display: flex;

        .code {
          width: 128px;
          flex: 1;
          margin-left: 8px;
          height: 48px;
          cursor: pointer;
          user-select: none;
          background: #98989d;
        }
      }

      .login_btn {
        width: 100%;
        height: 56px;
        border-radius: 2px;
        font-size: 16px;
        font-weight: 600;
        background: #0052d9;
        color: rgba(255, 255, 255, 0.9);
        line-height: 24px;
        margin-top: 8px;
      }

      .register_btn,
      .forget_btn {
        height: 56px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        color: #0052d9;
        margin-top: 16px;

        &.forget_btn {
          border: unset;
          box-shadow: unset;
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
</style>
