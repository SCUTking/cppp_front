<template>
  <div class="code_set_details">
    <scratchGui
      :langName="details.langName"
      :value="details.scratchSave"
      :workName="details.workName"
      :ccId="details.ccId"
      v-if="details.langName == 'scratch'"
    />
    <cpGui
      :langName="details.langName"
      :value="details.compileCode"
      :workName="details.workName"
      :ccId="details.ccId"
      v-else
    />
  </div>
</template>

<script setup>
import { useCommonStore, useUserStore } from '@/store';
import { ref, reactive, getCurrentInstance, onMounted, computed } from 'vue';
import { cpGui, scratchGui } from '@/components';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

onMounted(() => {
  swId.value = proxy.$router.currentRoute.value.query.swid;

  getDetails();
});
const swId = ref(),
  details = ref({}),
  getDetails = () => {
    proxy.$api.getStudentWorkById({ swId: swId.value }).then((res) => {
      if (res.resultCode == 200) {
        details.value = res.data;
        details.value.workName = details.value.workName.split('.')[0];
        commonStore.s_set_breadcrumb([
          { label: '个人中心', href: '/user/personalCenter' },
          { label: '我的学习' },
          { label: '我的作品&代码集' },
          { label: details.value.workName },
        ]);
      }
    });
  };
</script>

<style lang="less" scoped>
.code_set_details {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
