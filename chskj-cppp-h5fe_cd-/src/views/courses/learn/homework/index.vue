<template>
  <div class="homework_box">
    <completedHomework
      v-if="isFinish && paperId"
      :paperId="paperId"
      :tags="tags"
    ></completedHomework>
    <homeworkBeingDone
      :paperId="paperId"
      :course_chapter_content="props.courseChapter?.course_chapter_content"
      @submitPaper="submitPaper"
      v-else-if="paperId"
      :tags="tags"
    ></homeworkBeingDone>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { get, set } from '@vueuse/core';
import homeworkBeingDone from './homeworkBeingDone.vue';
import completedHomework from './completedHomework.vue';

const props = defineProps({ courseChapter: Object, tags: Array });
const isFinish = ref(false);
const paperId = ref(0);

watch(
  () => props.courseChapter,
  async (data) => {
    if (data?.course_chapter_content?.paperId) {
      const paperId1 = data.course_chapter_content.paperId;
      set(paperId, paperId1);
      set(isFinish, data.course_chapter_content.ifDoneWork);
    }
  },
  { immediate: true }
);
const submitPaper = () => {
  set(isFinish, true);
};
</script>

<style lang="less" scoped></style>
