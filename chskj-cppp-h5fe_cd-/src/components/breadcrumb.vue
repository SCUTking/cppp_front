<template>
  <div class="breadcrumb__home_icon" @click="$router.push('/')">
    <slot name="homeIcon">
      <img src="@/assets/header/home.png" alt="home" />
    </slot>
  </div>

  <div class="breadcrumb__separator_line"></div>

  <a-breadcrumb :separator="props.separator">
    <a-breadcrumb-item
      v-for="(item, index) in commonStore.breadcrumbs"
      @click="clickLink(item)"
      :href="item.href"
      :key="index"
      >{{ item.label }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup>
import { useCommonStore } from '@/store';
import { getCurrentInstance, onMounted, watchEffect } from 'vue';

const { proxy } = getCurrentInstance(),
  commonStore = useCommonStore();

const props = defineProps({
  separator: { type: String, default: '/' },
  itemColor: { type: String },
  lastItemColor: { type: String },
});

watchEffect(() => {
  setTimeout(() => {
    const linkArr = document.getElementsByClassName('ant-breadcrumb-link');
    Array.from(linkArr).forEach((link, index) => {
      const color =
        index != linkArr.length - 1 ? props.itemColor : props.lastItemColor;
      link.style.color = color;
      link.nextElementSibling.style.color = color;
    });
  }, 500);
});

const clickLink = ({ href }) => {
  href && proxy.$router.push(href);
};
</script>

<style lang="less" scoped>
.breadcrumb__home_icon {
  width: 28px;
  height: 28px;
  cursor: pointer;
  margin-left: 24px;
  
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.breadcrumb__separator_line {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.05);
  margin-left: 8px;
}

.ant-breadcrumb {
  font-size: 20px;
  margin-left: 16px;
  color: rgba(255, 255, 255, 0.55);

  & > span:last-child {
    color: rgba(255, 255, 255, 0.9);
  }

  :deep(.ant-breadcrumb-separator) {
    color: unset;
  }

  :deep(a),
  :deep(.ant-breadcrumb-link) {
    color: unset;
  }
}
</style>
