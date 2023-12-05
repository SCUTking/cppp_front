<!--
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-02-15 11:05:22
-->
<template>
  <a-result status="404" title="404" sub-title="抱歉，你访问的页面不存在。">
    <template #extra>
      <a-button type="primary" @click="$router.push({ path: '/' })"> 回到主页 </a-button>
    </template>
  </a-result>
</template>

<script setup>
</script>
