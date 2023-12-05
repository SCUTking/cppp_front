<template>
  <div class="breadcrumb">
    <Breadcrumb
      separator=">"
      itemColor="rgba(0,0,0,0.4)"
      lastItemColor="rgba(0,0,0,0.9)"
    >
      <template #homeIcon>
        <img src="@/assets/course/bread_home.png" alt="home" />
      </template>
    </Breadcrumb>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';
import { Breadcrumb } from '@/components';

const { proxy } = getCurrentInstance();
</script>

<style lang="less" scoped>
.breadcrumb {
  width: 100%;
  height: 56px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
