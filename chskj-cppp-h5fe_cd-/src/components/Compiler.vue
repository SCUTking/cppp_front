<!--
 * @Date: 2023-05-15 17:45:54
 * @LastEditTime: 2023-05-16 10:05:16
-->
<template>
  <div ref="compilerRef"></div>
</template>

<script setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  toRef,
  watch,
  watchEffect,
} from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
//引入cpp和python关键词高亮
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js';
// 引入搜索/替换功能  CTRl+F COMMAND+F
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';
// 引入自定义配置
import { monacoConfig } from '@/config/monaco.editor.config';

onMounted(() => {
  initEditor();
});

onUnmounted(() => {
  dispose();
});

const { proxy } = getCurrentInstance();
const props = defineProps({
  language: { type: String, default: () => '' },
  value: { type: String, default: () => '' },
  readOnly: { type: Boolean, default: () => false },
});
const language = toRef(props, 'language'),
  value = toRef(props, 'value'),
  readOnly = toRef(props, 'readOnly');

// 编辑器容器
let editor = null;

// 初始化
const initEditor = () => {
  editor?.dispose();
  monaco.editor.defineTheme('MyTheme', {
    base: 'vs',
    inherit: true,
    rules: [{ background: '#FBFBFA' }],
    colors: {
      'editor.background': '#FBFBFA',
    },
  });
  monaco.editor.setTheme('MyTheme');

  editor = monaco.editor.create(
    proxy.$refs.compilerRef,
    Object.assign(monacoConfig, {
      language: language.value,
      value: value.value,
      fontSize: 18,
      readOnly: readOnly.value,
    })
  );
};
watch(language, (data) => {
  if (data) initEditor();
});
watch(value, (data) => {
  editor.setValue(data);
});
// 销毁
const dispose = () => {
  editor?.dispose();
};
// 获取编辑器内容
const getValue = () => {
  return editor.getValue();
};
// 重新加载编辑器
defineExpose({ getValue, initEditor });
</script>

<style lang="less" scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
