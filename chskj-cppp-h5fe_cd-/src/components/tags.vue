<template>
  <div class="tags">
    <a-space direction="vertical">
      <template v-if="tags.length && tags[0] != '0+'">
        <a-tag class="tag" v-for="tag in tags" :key="tag[id]">
          {{ tag[label] ?? tag }}</a-tag
        >
      </template>
      <a-tag class="tag" v-else>暂无</a-tag>
    </a-space>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const props = defineProps({
  tags: Array,
  label: { type: String, default: 'label' },
  id: { type: String, default: 'id' },
});
</script>

<style lang="less" scoped>
.tags {
  width: 100%;

  .ant-space-vertical {
    flex-direction: row;
    flex-wrap: wrap;

    .tag {
      height: 28px;
      padding: 4px 16px;
      box-sizing: border-box;
      background: #e3f9e9;
      border-radius: 14px;
      font-size: 12px;
      font-weight: 600;
      color: #2ba471;
      border-color: #2ba471;
      margin-right: 0;
      display: flex;
      align-items: center;
    }
  }
}
</style>
