<!--
 * @Date: 2023-05-15 17:32:08
 * @LastEditTime: 2023-05-22 10:20:05
-->
<template>
  <div class="code_compiler">
    <Compiler
      class="complier"
      ref="editorRef"
      :language="props.langName"
      :value="props.value"
    />

    <a-input
      class="input_value"
      v-model:value="inputValue"
      placeholder="程序输入"
    />

    <div class="tips">
      <a-button @click="run">
        <template #icon><img src="@/assets/learn/code.png" /></template>
        <span>运行代码</span>
      </a-button>
      <a-button class="save_btn" @click="openSaveModal">
        <template #icon><img src="@/assets/learn/save.png" /></template>
        <span>保存代码</span>
      </a-button>
      <saveModal
        ref="saveModalRef"
        :language="langName"
        :saveName="workName"
        :compileCode="compileCode"
        :compileOutput="outputValue"
        :ccId="ccId"
      />

      <p class="text">
        *
        如需程序输入，请填写后点击运行代码，否则忽略输入直接运行代码；运行代码后得出执行结果
      </p>
    </div>

    <pre class="output_value" v-html="outputValue"></pre>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { Compiler } from '@/components';
import { handleFreeCompile } from '@/utils';
import saveModal from '@/views/courses/learn/study/saveModal.vue';

const { proxy } = getCurrentInstance();

const editorRef = ref(null);

const props = defineProps({
    langName: String,
    value: String,
    workName: String,
    ccId: String,
  }),
  compileCode = ref(''),
  inputValue = ref(''),
  run = () => {
    const params = {
      code: editorRef.value.getValue(),
      langName: props.langName,
      input: inputValue.value,
    };
    handleFreeCompile(params).then((res) => {
      const result = JSON.parse(res.data).result;
      outputValue.value = result.output;
      proxy.$message.info(res.resultMsg);
    });
  },
  outputValue = ref();

const saveModalRef = ref(null),
  openSaveModal = () => {
    compileCode.value = editorRef.value.getValue();
    saveModalRef.value.open();
  };
</script>

<style lang="less" scoped>
.code_compiler {
  width: 100%;
  flex: 1;
  background: #ffffff;
  overflow-y: auto;
  padding: 15px 16px 16px 16px;
  box-sizing: border-box;

  .complier {
    width: 100%;
    height: 452px;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .input_value {
    width: 852px;
    height: 40px;
    border-radius: 3px;
    border: 1px solid #dcdcdc;
    padding: 8px 12px;
    box-sizing: border-box;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.4);
    line-height: 24px;
    margin-top: 16px;
  }

  .tips {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    margin-top: 16px;

    .ant-btn {
      width: 142px;
      height: 100%;
      background: #ffffff;
      border-radius: 3px;
      border: 1px solid #0052d9;
      font-size: 16px;
      color: #0052d9;
      line-height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.save_btn {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(0, 0, 0, 0.4);
        color: rgba(0, 0, 0, 0.9);
        margin-left: 16px;

        img {
          opacity: 0.9;
        }
      }

      img {
        width: 18px;
        height: 18px;
        margin-right: 16px;
      }
    }

    .text {
      height: 28px;
      font-size: 16px;
      color: #e37318;
      line-height: 28px;
      margin-left: 24px;
    }
  }

  .output_value {
    width: 100%;
    height: 158px;
    // background: #f3f3f3;
    border-radius: 3px;
    border: 1px solid #dcdcdc;
    margin-top: 16px;
  }
}
</style>
