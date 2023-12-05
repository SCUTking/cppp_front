<template>
  <div class="intro" v-html="props.description"></div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const props = defineProps({ description: Object });
</script>

<style lang="less" scoped>
.intro {
  padding: 0 116px 24px 116px;
  box-sizing: border-box;

  :deep(img) {
    max-width: 100% !important;
  }
}
</style>
