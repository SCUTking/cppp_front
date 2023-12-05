<!--
 * @Date: 2023-05-15 17:01:33
 * @LastEditTime: 2023-05-16 11:28:44
-->
<template>
  <div class="knowledge">
    <p class="label">相关知识点</p>
    <Tags :tags="tags" label="knowledge" id="ckId" />
  </div>
</template>

<script setup>
import { reactive, toRef } from 'vue';
import { Tags } from '@/components';

const props = defineProps({ tags: Array }),
  tags = toRef(props, 'tags');
</script>

<style lang="less" scoped>
.knowledge {
  width: 100%;
  height: fit-content;
  background: #ffffff;
  box-shadow: inset 0px -1px 0px 0px #e7e7e7;
  padding: 7px 16px 6px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;

  .label {
    padding-right: 16px;
    flex-shrink: 0;
    height: 28px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    line-height: 28px;
  }
}
</style>
