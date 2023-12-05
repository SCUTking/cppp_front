<template>
  <div ref="modalRef">
    <a-modal
      v-model:visible="visible"
      :footer="null"
      :closable="false"
      :maskClosable="false"
      :getContainer="() => $refs.modalRef"
      @afterClose="onClose"
      centered
    >
      <div class="header">
        <span class="title">{{ typeMap[type] }}</span>
        <img
          src="@/assets/header/closeBlack.png"
          alt="close"
          class="close_img"
          @click="onClose"
        />
      </div>

      <div class="content">
        <!-- 绑定手机号 -->
        <template v-if="type == 0">
          <p class="tips">
            {{
              isNext
                ? '* 更换后，新手机号将用于登录华园科创 AI智慧教学平台'
                : '* 为了您的账号安全，请先用当前手机号验证身份'
            }}
          </p>

          <a-form :model="form" autocomplete="off" @finish="onSubmit">
            <a-form-item label="手机号码" name="mobile">
              <a-input
                class="phone_input"
                v-model:value="form.mobile"
                placeholder="请输入新手机号码"
                maxlength="11"
                :disabled="!type && !isNext"
              />
            </a-form-item>
            <a-form-item label="验证码" name="code">
              <div class="code_box">
                <a-input
                  class="code_input"
                  v-model:value="form.code"
                  placeholder="请输入6位验证码"
                  maxlength="6"
                />
                <p :class="['text', { sended_text: isSend }]" @click="sendSms">
                  获取验证码
                </p>
              </div>
            </a-form-item>

            <a-space>
              <a-button
                class="btn change_btn"
                type="primary"
                html-type="submit"
              >
                <span>{{ isNext ? '确认更换' : '下一步' }}</span>
              </a-button>
              <a-button
                class="btn unchange_btn"
                type="primary"
                @click="onClose"
              >
                <span>{{ isNext ? '暂不更换' : '暂不验证' }}</span>
              </a-button>
            </a-space>
          </a-form>
        </template>
        <!-- 绑定邮箱 -->
        <template v-else-if="type == 1">
          <p class="tips">* 请输入验证邮件你的验证码</p>

          <a-form :model="form" autocomplete="off" @finish="onSubmit">
            <a-form-item label="电子邮箱" name="email">
              <a-input
                class="phone_input"
                v-model:value="form.email"
                placeholder="请输入新电子邮箱"
              />
            </a-form-item>
            <a-form-item label="验证码" name="code">
              <div class="code_box">
                <a-input
                  class="code_input"
                  v-model:value="form.code"
                  placeholder="请输入6位验证码"
                  maxlength="6"
                />
                <p
                  :class="['text', { sended_text: isSend }]"
                  @click="sendEmail"
                >
                  获取验证码
                </p>
              </div>
            </a-form-item>

            <a-space>
              <a-button
                class="btn change_btn"
                type="primary"
                html-type="submit"
              >
                <span>确认绑定</span>
              </a-button>
              <a-button
                class="btn unchange_btn"
                type="primary"
                @click="onClose"
              >
                <span>暂不绑定</span>
              </a-button>
            </a-space>
          </a-form>
        </template>
        <!-- 绑定微信 -->
        <template v-else-if="type == 2">
          <div class="qr_code">
            <div v-if="state !== ''" class="mask">
              <a-space :size="4">
                <span class="tip">{{
                  state === 'check-circle-filled' ? '扫码成功' : '二维码已失效'
                }}</span>
                <a-button
                  v-if="state === 'error-circle-filled'"
                  type="primary"
                  class="refresh_btn"
                  @click="getQrCode"
                  >刷新</a-button
                >
              </a-space>
            </div>
            <qrcode-vue v-if="qrCode" :value="qrCode" :size="160" level="M" />
          </div>
        </template>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import { useUserStore } from '@/store';
import { ref, reactive, getCurrentInstance, onBeforeUnmount } from 'vue';
import QrcodeVue from 'qrcode.vue';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore();

const emits = defineEmits(['success']);

const visible = ref(false),
  form = ref({ mobile: '', code: '', email: '' }),
  typeMap = ref({ 0: '更换手机', 1: '绑定邮箱', 2: '绑定微信' }),
  type = ref(-1),
  isNext = ref(false),
  onOpen = (num) => {
    type.value = num;
    visible.value = true;
    if (num == 0) form.value.mobile = userStore.userInfo.phone;
    if (num == 2) getQrCode();
  },
  onClose = () => {
    if (type.value == 0) isNext.value = false;
    if (type.value == 2) clearInterval(refreshTime.value);

    type.value = -1;
    visible.value = false;
    form.value = { mobile: '', code: '', email: '' };
  };
/**
 * 手机号码绑定
 */
const isSend = ref(false),
  sendSms = () => {
    const { mobile } = form.value;
    if (!mobile || isSend.value) return;

    isSend.value = true;
    proxy.$api
      .sendSms({ mobile })
      .then((res) => {
        if (res && res.resultCode == 200) {
          proxy.$message.info('发送成功!');
        }
      })
      .finally(() => {
        isSend.value = false;
      });
  },
  /**
   * 邮箱绑定
   */
  sendEmail = () => {
    const { email } = form.value;
    if (!email || isSend.value) return;

    isSend.value = true;
    proxy.$api
      .sendEmail({ email })
      .then((res) => {
        if (res && res.resultCode == 200) {
          proxy.$message.info('发送成功!');
        }
      })
      .finally(() => {
        isSend.value = false;
      });
  };

/**
 * 微信绑定
 */
const qrCode = ref(),
  wxToken = ref(),
  getQrCode = () => {
    proxy.$api.bindWx().then((res) => {
      if (res.resultCode == 200) {
        const { authorize_url, str } = res.data;
        qrCode.value = `${authorize_url}?str=${str}`;
        wxToken.value = str;
        state.value = '';
        getOpenid();
      }
    });
  },
  refreshTime = ref(null),
  state = ref(''),
  openid = ref(),
  getOpenid = () => {
    refreshTime.value = setInterval(() => {
      proxy.$api.getWxInfo({ wxToken: wxToken.value }).then((res) => {
        if (res.resultCode === 200) {
          clearInterval(refreshTime.value);
          state.value = 'check-circle-filled';
          const { openid, nickname } = res.data;
          bindOpenId(openid, nickname);
        } else if (res.resultCode === 400) {
          clearInterval(refreshTime.value);
          state.value = 'error-circle-filled';
          // 失效
        }
      });
    }, 1000);
  },
  bindOpenId = (openId, wxNickname) => {
    proxy.$api.bindOpenId({ openId, wxNickname }).then((res) => {
      if (res.resultCode == 200) {
        proxy.$message.info(res.resultMsg);
        emits('success');
        onClose();
      }
    });
  };

/**
 * 提交
 */
const onSubmit = () => {
  if (type.value == 0) {
    // 绑定新手机
    const params = { ...form.value };
    delete params.email;
    if (!isNext.value) {
      // 验证旧手机
      proxy.$api.verifyPhone(params).then((res) => {
        if (res && res.resultCode == 200) {
          isNext.value = true;
          form.value = { mobile: '', code: '', email: '' };
        }
      });
    } else {
      proxy.$api.updatePhone(params).then((res) => {
        if (res && res.resultCode == 200) {
          proxy.$message.info('更换成功！');
          emits('success');
          onClose();
        }
      });
    }
  }
  if (type.value == 1) {
    const params = { ...form.value };
    delete params.mobile;

    proxy.$api.bindEmail(params).then((res) => {
      if (res && res.resultCode == 200) {
        emits('success');
        onClose();
      }
    });
  }
};

onBeforeUnmount(() => {
  clearInterval(refreshTime.value);
});
defineExpose({ onOpen });
</script>

<style lang="less" scoped>
:deep(.ant-modal) {
  width: 542px !important;
  height: fit-content;
  background: #ffffff;
  padding: 0 16px 32px 16px;

  .ant-modal-content {
    width: 100%;
    height: 100%;
    box-shadow: unset;

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
        padding: 12px 0 12px 8px;
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
        height: fit-content;
        padding: 16px 0 0 0;
        box-sizing: border-box;

        .tips {
          width: 100%;
          height: fit-content;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 22px;
        }

        .ant-form {
          padding-top: 7px;

          .ant-form-item {
            margin-top: 17px;
            margin-bottom: 0;

            .ant-col.ant-form-item-label {
              width: 81px;
            }

            .ant-col.ant-form-item-control {
              width: 280px;
              height: 32px;
              border-radius: 3px;
              margin-left: 8px;

              .ant-form-item-control-input {
                width: 280px;

                .code_box {
                  width: 100%;
                  display: flex;
                  align-items: center;

                  .code_input {
                    width: 160px;
                  }

                  .text {
                    width: 103px;
                    height: 22px;
                    font-size: 14px;
                    color: #0052d9;
                    line-height: 22px;
                    margin-left: 16px;
                    cursor: pointer;

                    &.sended_text {
                      color: #000;
                      cursor: not-allowed;
                    }
                  }
                }
              }
            }
          }

          .ant-space {
            width: 100%;
            justify-content: flex-end;
            margin-top: 77px;

            .btn {
              width: 90px;
              height: 32px;
              border-radius: 3px;
              line-height: 22px;
              font-size: 14px;

              &.change_btn {
                background: #0052d9;
                color: rgba(255, 255, 255, 0.9);
              }

              &.unchange_btn {
                background: #ffffff;
                border: 1px solid #dcdcdc;
                color: rgba(0, 0, 0, 0.9);
              }
            }
          }
        }

        .qr_code {
          width: 180px;
          height: 180px;
          position: relative;
          padding: 10px;
          box-sizing: border-box;
          border-radius: 15px;
          margin: auto;
          border: 1px dashed;

          .mask {
            position: absolute;
            width: 180px;
            height: 180px;
            top: 0;
            left: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: rgba(140, 140, 140, 0.7);
            border-radius: 15px;

            .tip {
              color: #fff;
              font-weight: 600;
              font-size: 14px;
              padding: 5px;
              box-sizing: border-box;
              border-radius: 6px;
            }

            .refresh_btn {
              font-weight: 600;
              font-size: 14px;
              border-radius: 8px;
              padding: 5px;
              background: #0052d9;
              border-color: transparent;
            }
          }
        }
      }
    }
  }
}
</style>
