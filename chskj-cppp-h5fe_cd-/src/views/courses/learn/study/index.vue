<!--
 * @Date: 2023-05-15 17:12:51
 * @LastEditTime: 2023-05-16 10:06:54
-->
<template>
  <div class="study">
    <knowledge :tags="knowledgeTags" />
    <scratchGui
      :langName="langName"
      :ccId="$router.currentRoute.value.query.ccId"
      v-if="langName == 'scratch'"
    />
    <cpGui
      :langName="langName"
      :ccId="$router.currentRoute.value.query.ccId"
      v-else
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, toRef } from 'vue';
import knowledge from './knowledge.vue';
import { cpGui, scratchGui } from '@/components';

const props = defineProps({ courseChapter: Object, tags: Array });
const knowledgeTags = computed(() => {
  let mList = [];
  props.tags?.forEach((item) => {
    mList.push(item.knowledge);
  });
  return [...new Set(mList)];
});
const langName = computed(() => {
  let langName;
  if (props.courseChapter)
    langName = props?.courseChapter?.course_chapter_content.langName;
  return langName;
});
</script>

<style lang="less" scoped>
.study {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
