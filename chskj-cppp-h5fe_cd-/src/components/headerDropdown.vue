<template>
  <a-dropdown
    @click.prevent
    placement="bottomRight"
    :getPopupContainer="() => $refs.rightRef"
  >
    <div class="user_info_box" ref="rightRef">
      <img
        :src="
          userInfo.avatar ??
          'https://tdesign.gtimg.com/miniprogram/images/avatar1.png'
        "
        alt="avatar"
        class="avatar"
      />
      <p class="name">{{ userInfo.nickname ?? commonStore.defaultName }}</p>
      <img src="@/assets/header/arrowDownWhite.png" alt="arrow" class="arrow" />
    </div>
    <template #overlay>
      <a-menu v-model:selectedKeys="menuKey" @click="handleClick">
        <a-menu-item :key="0">
          <img
            :src="
              userInfo.avatar ??
              'https://tdesign.gtimg.com/miniprogram/images/avatar1.png'
            "
            alt="avatar"
            class="avatar"
          />
          <div class="info_box">
            <p class="username">
              {{ userInfo.nickname ?? commonStore.defaultName }}
            </p>
            <p class="phone">{{ userInfo.phone }}</p>
          </div>
        </a-menu-item>
        <a-menu-item :key="2">
          <span class="label personal_center"></span>
          <p class="value">个人中心</p>
        </a-menu-item>
        <a-menu-item :key="3">
          <span class="label edit_pass"></span>
          <p class="value">修改密码</p>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item :key="4">
          <span class="label logout"></span>
          <p class="value">退出登录</p>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <EditPassword ref="editPasswordRef" />
</template>

<script setup>
import { reactive, ref, getCurrentInstance, computed } from 'vue';
import { EditPassword } from '@/components';
import { useCommonStore, useUserStore } from '@/store';
import { Modal } from 'ant-design-vue';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

const userInfo = computed(() => {
  if (userStore.userInfo == null) return;
  const { phone, nickname, avatar } = userStore.userInfo;
  return { phone, nickname, avatar };
});

// 用户信息下拉框
const menuKey = ref([-1]),
  handleClick = (e) => {
    let key = [e.key];
    switch (e.key) {
      case 0:
        key = menuKey.value;
        break;
      case 1:
        break;
      case 2:
        proxy.$router.push({ name: 'personalCenter' });
        commonStore.s_set_pcMapName('MStudyManage');
        break;
      case 3:
        key = menuKey.value;
        proxy.$refs.editPasswordRef.onOpen();
        break;
      case 4:
        Modal.confirm({
          content: '确定退出？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            userStore.logout();
          },
          onCancel() {
            menuKey.value = [-1];
          },
        });
        break;
    }
    menuKey.value = key;
  };
</script>

<style lang="less" scoped>
.user_info_box {
  height: 48px;
  border-radius: 8px;
  padding: 6px 16px 6px 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.26);
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .name {
    width: 95px;
    height: 20px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    line-height: 20px;
    margin-left: 8px;
  }

  .arrow {
    width: 16px;
    height: 16px;
  }

  :deep(.ant-dropdown) {
    width: 243px;
    height: fit-content;
    background: #ffffff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    padding: 8px;

    .ant-dropdown-menu {
      padding: 0;
      box-shadow: unset;

      .ant-dropdown-menu-item {
        padding: 0;

        &:nth-of-type(1) {
          width: 100%;
          height: 52px;
          border-bottom: 1px solid #f3f3f3;
          margin-bottom: 8px;

          &:hover {
            background-color: unset;
            cursor: default;
          }
        }

        &:not(:nth-of-type(1)) {
          width: 100%;
          height: 40px;

          &:hover {
            background-color: #ecf2fe;
          }
        }

        &:nth-of-type(4) {
          margin-bottom: 8px;
        }

        &.ant-dropdown-menu-item-selected {
          background-color: #ecf2fe;
        }

        .ant-dropdown-menu-title-content {
          display: flex;
          align-items: center;
          padding: 6px 9px;
          box-sizing: border-box;

          .info_box {
            width: fit-content;
            height: fit-content;
            margin-left: 8px;

            .username {
              height: 20px;
              font-size: 12px;
              font-weight: 600;
              color: rgba(0, 0, 0, 0.9);
              line-height: 20px;
            }

            .phone {
              height: 16px;
              font-size: 10px;
              color: rgba(0, 0, 0, 0.6);
              line-height: 16px;
            }
          }

          .label {
            width: 28px;
            height: 28px;
          }

          .personal_center {
            background: url('@/assets/header/userBlack.png');
            background-size: 100% 100%;
          }

          .edit_pass {
            background: url('@/assets/header/editPassBlack.png');
            background-size: 100% 100%;
          }

          .logout {
            background: url('@/assets/header/logoutBlack.png');
            background-size: 100% 100%;
          }

          .value {
            height: 28px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.9);
            line-height: 28px;
            margin-left: 8px;

            &.value_active {
              color: #0052d9;
            }
          }
        }

        &:hover {
          .value {
            color: #0052d9;
          }

          .personal_center {
            background: url('@/assets/header/userBlue.png');
            background-size: 100% 100%;
          }

          .edit_pass {
            background: url('@/assets/header/editPassBlue.png');
            background-size: 100% 100%;
          }

          .logout {
            background: url('@/assets/header/logoutBlue.png');
            background-size: 100% 100%;
          }
        }
      }
    }
  }
}
</style>
