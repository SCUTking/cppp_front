<!--
 * @Date: 2023-04-19 16:15:34
 * @LastEditTime: 2023-06-08 14:19:28
-->
<!--
 * @Date: 2023-04-19 16:15:34
 * @LastEditTime: 2023-06-07 17:10:20
-->
<template>
  <div class="header" :class="'header_' + routerName">
    <div class="left_box">
      <!-- 华园科创图标S -->
      <img
        src="@/assets/header/logoText.png"
        alt="logo_text"
        class="logo_text"
        @click="$router.push({ name: 'category' })"
      />
      <!-- 图标F -->
      <!-- 机构图标S -->
      <template v-if="companyLogo">
        <span class="mix">×</span>
        <img :src="companyLogo" alt="companyLogo" class="company_logo" />
      </template>
      <!-- 机构图标F -->

      <!-- 面包屑S -->
      <Breadcrumb
        v-if="isShowBreadcrumb"
        itemColor="rgba(255,255,255,0.55)"
        lastItemColor="rgba(255,255,255,0.9)"
      />
      <!-- 面包屑F -->

      <!-- 课程下拉弹窗S -->
      <div
        v-if="isShowSelector"
        :class="['selector', { selector_active: isOpened }]"
        @click="handleClickSelector"
      >
        <p class="label">{{ course.courseName }}</p>
        <img
          :class="['selector_arrow', { selector_arrow_active: isOpened }]"
          src="@/assets/header/arrowDown.png"
          alt="arrow"
        />
      </div>
      <CourseClassify
        ref="courseClassifyRef"
        :course="course"
        @close="isOpened = false"
        @setCourse="(e) => (course = e)"
      />
      <!-- 课程下拉弹窗F -->
    </div>

    <!-- 在线课程、练习题库tabS -->
    <div class="course_practice_box" v-show="isShowTabs">
      <div
        v-for="tab in tabs"
        :class="['btn_box', { active_tab_box: tab.name == activeTabName }]"
        :key="tab.name"
        @click="clickTab(tab.name)"
      >
        <img
          :src="tab.name == activeTabName ? tab.activeIcon : tab.icon"
          alt="online"
          class="icon"
        />
        <span class="label">{{ tab.label }}</span>
      </div>
    </div>
    <!-- 在线课程、练习题库tabF -->

    <div class="right_box">
      <!-- 练习中心S -->
      <!-- <a-button
        class="training_center_btn"
        v-if="isShowTrainingCenter"
        @click="$router.push('/trainingCenter')"
      >
        <template #icon>
          <img src="@/assets/header/trainingCenter.png" alt="" />
        </template>
        练习中心</a-button
      > -->
      <!-- 练习中心F -->

      <!-- 我的课程S -->
      <template v-if="userStore.token">
        <a-button
          class="my_course"
          @click="handleClick"
          v-if="isShowMyCourseBtn"
        >
          <template #icon>
            <span class="label"></span>
          </template>
          <span class="value">我的课程</span>
        </a-button>
        <!-- 我的课程F -->

        <!-- 个人信息S -->
        <HeaderDropdown />
        <!-- 个人信息F -->
      </template>
      <!-- 登录、注册按钮S -->
      <template v-else>
        <a-space>
          <a-button class="btn login_btn" ghost @click="go2login(0)">
            <span>登录</span>
          </a-button>
          <a-button class="btn register_btn" @click="go2login(1)">
            <span>注册</span>
          </a-button>
        </a-space>
      </template>
      <!-- 登录、注册按钮F -->
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  watchEffect,
  computed,
  reactive,
  onMounted,
} from 'vue';
import { useRoute } from 'vue-router';
import { CourseClassify, HeaderDropdown, Breadcrumb } from '@/components';
import { useCommonStore, useUserStore } from '@/store';

const { proxy } = getCurrentInstance(),
  router = useRoute(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

onMounted(() => {
  if (userStore.token) getStuInfo();
});

/**
 * 获取用户信息
 */
const getStuInfo = () => {
  proxy.$api.getStuInfo().then((res) => {
    if (res?.resultCode == 200) userStore.s_set_user_info(res.data);
  });
};
/**
 * 获取用户信息
 */

/**
 * 在线课程/练习题库tab
 */
const isShowTabs = ref(false),
  tabs = reactive([
    {
      name: 'category',
      label: '在线课程',
      icon: require('@/assets/header/online.png'),
      activeIcon: require('@/assets/header/online_active.png'),
    },
    {
      name: 'database',
      label: '练习题库',
      icon: require('@/assets/header/practice.png'),
      activeIcon: require('@/assets/header/practice_active.png'),
    },
  ]),
  activeTabName = ref({}),
  clickTab = (name) => {
    if (activeTabName.value == name) return;
    activeTabName.value = name;
    proxy.$router.push({ name });
  };
/**
 * 在线课程/练习题库tab
 */

/**
 * 我的课程
 */
const handleClick = () => {
  proxy.$router.push({ name: 'personalCenter' });
  commonStore.s_set_pcMapName('MStudyManage');
};
/**
 * 我的课程
 */

/**
 * 机构logo
 */
const isSpecialLogo = ref(false),
  companyLogo = computed(() => {
    const { companyInfos } = userStore.userInfo ?? {};
    const { companyLogo } = commonStore;

    let logo = companyInfos?.length == 1 ? companyInfos[0]?.companyLogo : null;
    if (isSpecialLogo.value) logo = companyLogo;

    return logo;
  });
/**
 * 机构logo
 */

const routerName = ref('');
watchEffect(() => {
  const name = router.name;

  routerName.value = name;

  if (['category', 'database'].includes(name)) {
    isShowTabs.value = true;
    activeTabName.value = name;
  }

  // 单元课时、学习课次展示独特的logo
  isSpecialLogo.value = ['content', 'learn', 'intro'].includes(name);
});

const isShowBreadcrumb = computed(() => {
    return router.meta.breadcrumb;
  }),
  isShowSelector = computed(() => {
    return (
      ['content', 'intro'].includes(routerName.value) &&
      Object.keys(course).length
    );
  }),
  isShowTrainingCenter = computed(() => {
    return ['content', 'learn'].includes(routerName.value);
  }),
  isShowMyCourseBtn = computed(() => {
    return !router.meta.isHideMyCourseBtn;
  });

/**
 * 课程类别弹窗
 */
const isOpened = ref(false),
  course = ref({}),
  handleClickSelector = () => {
    isOpened.value = true;
    proxy.$refs.courseClassifyRef.open();
  };
/**
 * 课程类别弹窗
 */

/**
 * 登录/注册
 * @param {*} isRegister
 */
const go2login = (isRegister) => {
  if (isRegister) commonStore.s_set_is_register(true);
  proxy.$router.push({ name: 'login' });
};
/**
 * 登录/注册
 */
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 64px;
  background: #078d5c;
  padding: 0 24px 0 27px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  // &.header_content,
  // &.header_intro {
  //   padding: 0 16px 0 24px;
  // }

  // &.header_category,
  // &.header_event,
  // &.header_topicSet {
  //   padding: 0 100px;
  // }

  .left_box {
    height: 100%;
    display: flex;
    align-items: center;

    .logo_text {
      width: 160px;
      height: 100%;
      cursor: pointer;
    }

    .mix {
      width: fit-content;
      height: fit-content;
      padding: 0 20px 0 10px;
      box-sizing: border-box;
      color: #ffffff;
      font-size: 16px;
      text-align: center;
      line-height: 30px;
    }

    .company_logo {
      // width: 160px;
      max-height: 100%;
      object-fit: contain;
    }

    .logo {
      width: 64px;
      height: 100%;
    }

    .selector {
      height: 40px;
      border-radius: 3px;
      padding: 8px 24px;
      background: #ffffff;
      display: flex;
      align-items: center;
      margin-left: 16px;
      cursor: pointer;

      &.selector_active {
        background: #dcdcdc;
      }

      .label {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 24px;
      }

      .selector_arrow {
        width: 18px;
        height: 18px;
        margin-left: 12px;

        &.selector_arrow_active {
          transform: rotate(180deg);
          transition: all 0.5s ease;
        }
      }
    }
  }

  .course_practice_box {
    width: fit-content;
    height: 48px;
    background: rgba(0, 0, 0, 0.26);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    padding: 8px;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -24px);
    display: flex;
    align-items: center;

    .btn_box {
      width: fit-content;
      height: 100%;
      padding: 8px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        border-radius: 4px;
      }

      &.active_tab_box {
        background: #f9f6d0;
        border-radius: 4px;

        .label {
          color: #8b6600;
        }
      }

      .icon {
        width: 16px;
        height: 16px;
      }

      .label {
        height: 22px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        line-height: 22px;
        margin-left: 8px;
      }
    }
  }

  .right_box {
    height: fit-content;
    display: flex;
    align-items: center;

    .my_course {
      width: fit-content;
      height: 36px;
      background: transparent;
      border-radius: 3px;
      padding: 7px 16px 7px 8px;
      box-sizing: border-box;
      border-color: #ffffff;
      display: flex;
      align-items: center;
      margin-right: 16px;

      .label {
        width: 28px;
        height: 28px;
        background: url('@/assets/header/myCourseWhite.png');
        background-size: 100% 100%;
      }

      .value {
        height: 28px;
        font-size: 14px;
        color: #fff;
        line-height: 28px;
        margin-left: 8px;
      }

      &:hover {
        background: #f2f3ff;
        border-color: #f2f3ff;

        .label {
          background-image: url('@/assets/header/myCourseBlue.png');
          background-size: 100% 100%;
        }

        .value {
          color: #366ef4;
        }
      }
    }

    .training_center_btn {
      width: 112px;
      height: 32px;
      border-radius: 3px;
      border: 1px solid #ffffff;
      padding: 5px 16px 5px 8px;
      box-sizing: border-box;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      background: transparent;
      line-height: 22px;
      display: flex;
      align-items: center;
      margin-right: 16px;

      img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }

    .btn {
      height: fit-content;
      border-radius: 4px;
      padding: 7px 43px;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 22px;

      &.login_btn {
        border-color: rgba(255, 255, 255, 0.9);
        color: rgba(255, 255, 255, 0.9);
      }

      &.register_btn {
        border-color: #ffffff;
        color: #008858;
        background: #ffffff;
      }
    }
  }
}
</style>
