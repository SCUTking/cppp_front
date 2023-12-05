<template>
  <div class="personal_center">
    <div class="left_nav_box">
      <div class="userInfo_box">
        <img
          :src="
            userInfo.avatar ??
            'https://tdesign.gtimg.com/miniprogram/images/avatar1.png'
          "
          alt="avatar"
          class="avatar"
        />

        <div class="info_box">
          <span class="name">{{
            userInfo.nickname ?? commonStore.defaultName
          }}</span>

          <div class="text_box">
            <img
              src="@/assets/personalCenter/mobile.png"
              alt="mobile"
              class="icon"
            />
            <span class="text">{{ userInfo.phone }}</span>
          </div>
          <div class="text_box">
            <img
              src="@/assets/personalCenter/nav_personalInfo.png"
              alt="user"
              class="icon"
            />
            <div class="company_box" v-if="userInfo.companyInfos?.length">
              <span class="text" v-for="company in userInfo.companyInfos">
                {{ company?.companyName ?? '平台用户' }}
              </span>
            </div>
            <span class="text" v-else>{{ '暂无机构/学校' }}</span>
          </div>
        </div>
      </div>

      <div class="nav_box" v-for="item in navItems" :key="item.id">
        <p class="nav_title">{{ item.title }}</p>
        <div
          v-for="i in item.children"
          :key="i.title"
          :class="[
            'nav_item',
            i.className,
            { nav_active: i.mapName == currComName },
          ]"
          @click="clickNav(i)"
        >
          <img :src="i.icon" :alt="i.routerName" class="nav_icon" />
          <span class="nav_text">{{ i.title }}</span>
        </div>
      </div>
    </div>

    <div class="right_content_box">
      <component
        :is="currComponent"
        :userInfo="userInfo"
        @onGetUserInfo="getStuInfo"
      ></component>
    </div>
  </div>
</template>

<script setup>
import { useCommonStore, useUserStore } from '@/store';
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  computed,
  onBeforeMount,
} from 'vue';
import { useRoute } from 'vue-router';
import studyManage from './studyManage.vue';
import wrongQuestion from './wrongQuestion.vue';
import codeSet from './codeSet.vue';
import orderList from './orderList.vue';
import personalInfo from './personalInfo.vue';
import accountSettings from './accountSettings.vue';

const { proxy } = getCurrentInstance(),
  route = useRoute(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

onMounted(() => {
  currComponent.value = componentMap[currComName.value];
  // getStuInfo();
});

const navItems = reactive([
  {
    id: 1,
    title: '我的学习',
    children: [
      {
        title: '学习管理',
        mapName: 'MStudyManage',
        className: 'nav_study_manage',
        routerName: 'studyManage',
        icon: require('@/assets/personalCenter/nav_studyMan.png'),
      },
      {
        title: '我的错题',
        mapName: 'MWrongQuestion',
        className: 'nav_wrong_question',
        routerName: 'wrongQuestion',
        icon: require('@/assets/personalCenter/nav_wrongQ.png'),
      },
      {
        title: '我的作品&代码集',
        mapName: 'MCodeSet',
        className: 'nav_code_set',
        routerName: 'codeSet',
        icon: require('@/assets/personalCenter/nav_codeSet.png'),
      },
    ],
  },
  {
    id: 2,
    title: '订单中心',
    children: [
      {
        title: '我的订单',
        mapName: 'MOrderList',
        className: 'nav_order_list',
        routerName: 'orderList',
        icon: require('@/assets/personalCenter/nav_order.png'),
      },
    ],
  },
  {
    id: 3,
    title: '账号安全',
    children: [
      {
        title: '个人信息',
        mapName: 'MPersonalInfo',
        className: 'nav_personal_info',
        routerName: 'personalInfo',
        icon: require('@/assets/personalCenter/nav_personalInfo.png'),
      },
      {
        title: '账号设置',
        mapName: 'MAccountSettings',
        className: 'nav_account_settings',
        routerName: 'accountSettings',
        icon: require('@/assets/personalCenter/nav_accountSet.png'),
      },
    ],
  },
]);

const userInfo = computed(() => {
    return userStore.userInfo;
  }),
  getStuInfo = () => {
    proxy.$api.getStuInfo().then((res) => {
      if (res?.resultCode == 200) userStore.s_set_user_info(res.data);
    });
  };

const componentMap = {
    MStudyManage: studyManage,
    MWrongQuestion: wrongQuestion,
    MCodeSet: codeSet,
    MOrderList: orderList,
    MPersonalInfo: personalInfo,
    MAccountSettings: accountSettings,
  },
  currComName = computed(() => {
    return commonStore.pcMapName;
  }),
  currComponent = computed(() => {
    return componentMap[currComName.value];
  }),
  clickNav = (i) => {
    commonStore.s_set_pcMapName(i.mapName);
  };
</script>

<style lang="less" scoped>
.personal_center {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-image: url('@/assets/bg.png');
  background-size: 100% 1080px;
  background-repeat: no-repeat;
  display: flex;
  padding: 24px;
  box-sizing: border-box;

  .left_nav_box {
    width: 364px;
    height: fit-content;
    background: rgba(255, 255, 255, 0.55);
    border-radius: 16px;
    padding: 16px 16px 24px 16px;
    box-sizing: border-box;
    overflow-y: auto;

    .userInfo_box {
      width: 100%;
      height: fit-content;
      background: #ffffff;
      border-radius: 16px;
      display: flex;
      padding: 16px;
      box-sizing: border-box;

      .avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
      }

      .info_box {
        flex: 1;
        margin-left: 16px;

        .name {
          height: 28px;
          font-size: 16px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.9);
          line-height: 28px;
        }

        .text_box {
          display: flex;
          align-items: flex-start;
          margin-top: 8px;

          .icon {
            width: 20px;
            height: 20px;
          }

          .company_box {
            width: 100%;
            max-height: 110px;
            display: flex;
            flex-direction: column;
            overflow-y: auto;

            &::-webkit-scrollbar {
              width: 6px;
            }

            &::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.26);
              border-radius: 4px;
            }
          }

          .text {
            height: fit-content;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
            line-height: 20px;
            margin-left: 8px;
          }
        }
      }
    }

    .nav_box {
      width: 100%;
      height: fit-content;
      margin-top: 24px;

      .nav_title {
        width: 100%;
        height: 44px;
        line-height: 44px;
        font-size: 16px;
        font-weight: 600;
        color: #3d3d3d;
        margin-bottom: 8px;
      }

      .nav_item {
        width: 100%;
        height: 44px;
        background: #ffffff;
        border-radius: 8px;
        padding: 8px 17px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          background: #e3f9e9;
          outline: 1px solid #2ba471;

          .nav_text {
            color: #2ba471;
          }

          &.nav_study_manage img {
            content: url('@/assets/personalCenter/nav_studyMan_hover.png');
          }

          &.nav_wrong_question img {
            content: url('@/assets/personalCenter/nav_wrongQ_hover.png');
          }

          &.nav_code_set img {
            content: url('@/assets/personalCenter/nav_codeSet_hover.png');
          }

          &.nav_order_list img {
            content: url('@/assets/personalCenter/nav_order_hover.png');
          }

          &.nav_personal_info img {
            content: url('@/assets/personalCenter/nav_personalInfo_hover.png');
          }

          &.nav_account_settings img {
            content: url('@/assets/personalCenter/nav_accountSet_hover.png');
          }
        }

        &.nav_active {
          background: #2ba471;
          outline: 1px solid transparent;

          &.nav_study_manage img {
            content: url('@/assets/personalCenter/nav_studyMan_active.png');
          }

          &.nav_wrong_question img {
            content: url('@/assets/personalCenter/nav_wrongQ_active.png');
          }

          &.nav_code_set img {
            content: url('@/assets/personalCenter/nav_codeSet_active.png');
          }

          &.nav_order_list img {
            content: url('@/assets/personalCenter/nav_order_active.png');
          }

          &.nav_personal_info img {
            content: url('@/assets/personalCenter/nav_personalInfo_active.png');
          }

          &.nav_account_settings img {
            content: url('@/assets/personalCenter/nav_accountSet_active.png');
          }

          .nav_text {
            color: rgba(255, 255, 255, 0.9);
          }
        }

        &:not(:first-of-type) {
          margin-top: 8px;
        }

        .nav_icon {
          width: 28px;
          height: 28px;
        }

        .nav_text {
          font-size: 16px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.6);
          line-height: 24px;
          margin-left: 8px;
        }
      }
    }
  }

  .right_content_box {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    margin-left: 24px;

    :deep(.ant-pagination) {
      margin: 40px 0 20px 0;

      .ant-pagination-total-text {
        position: absolute;
        left: 0;
      }

      .ant-select-selector {
        width: 96px;
      }

      .ant-pagination-item-active {
        font-weight: 500;
        background: #0052d9;

        a {
          color: rgba(255, 255, 255, 0.9);
        }
      }
      .ant-pagination-options-quick-jumper {
        margin-left: 16px;
        background: #f3f3f3;
        border-radius: 3px;
        padding: 2px 8px;
        box-sizing: unset;
      }
    }
  }
}
</style>
