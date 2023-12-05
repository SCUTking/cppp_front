<!--
 * @Date: 2023-06-23 17:22:45
 * @LastEditTime: 2023-06-25 11:13:27
-->
<template>
  <div class="editor_box">
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      class="editor"
    />
    <div class="toolbar_box">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <div class="extra_box">
        <a-button
          class="send_btn"
          @click="emits('send', valueHtml)"
          :disabled="!isAllowedSend"
        >
          <span>发送</span>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  ref,
  shallowRef,
} from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { DomEditor } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

const { proxy } = getCurrentInstance();

const props = defineProps({
  isAllowedSend: Boolean,
  activeTab: Number,
});

// 实例化
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const emits = defineEmits(['send']);
const // 编辑器实例，必须用 shallowRef
  editorRef = shallowRef(),
  // 内容 HTML
  valueHtml = ref('');

// 编辑器配置
const mode = 'default',
  toolbarConfig = {
    toolbarKeys: [
      {
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
        key: 'group-image',
        menuKeys: ['uploadImage'],
        title: '图片',
      },
      'codeBlock',
    ],
  },
  //上传图片
  uploadImage = (file, insertFn) => {
    let name = file.name;
    let suffix = file.type.split('/')[1];
    name = name + '.' + suffix;

    let formData = new FormData();
    formData.append('file', file);

    const apiMap = { 0: 'uploadImageQ', 1: 'uploadImageD' };
    //上传方法
    proxy.$api[apiMap[props.activeTab]](formData).then((res) => {
      if (res.resultCode == 200) {
        const { data } = res;
        // 最后插入图片
        insertFn(data, name, data);
      }
    });
  },
  editorConfig = {
    placeholder: '我也来参与一下互动',
    MENU_CONF: {
      // 配置上传图片
      uploadImage: {
        customUpload: uploadImage, // uploadImage 是 methods 中的一个普通方法
      },
    },
  };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  editor != null && editor.destroy();
});

// 清空输入框
const clear = () => {
  valueHtml.value = '';
};

defineExpose({ clear });
</script>

<style lang="less" scoped>
.editor_box {
  width: 100%;
  height: 100%;

  .editor {
    height: 120px !important;

    :deep(.w-e-text-container) {
      max-width: 100%;

      [data-slate-editor] {
        padding: 8px 0;

        p {
          margin: unset;
        }

        :deep(.w-e-scroll::-webkit-scrollbar) {
          width: 6px !important;
        }

        .w-e-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.26);
          border-radius: 4px;
        }

        .w-e-modal {
          left: 0 !important;
          top: -250px !important;
        }
      }

      .w-e-bar {
        display: none;
      }

      .w-e-text-placeholder {
        top: 8px;
        left: 0;
      }
    }
  }

  .toolbar_box {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;

    :deep(.w-e-bar.w-e-bar-show.w-e-toolbar) {
      padding: 0;

      .w-e-bar-item {
        height: fit-content;
        padding: 0;

        button::before,
        button::after {
          display: none;
        }

        button {
          height: fit-content;
          padding: 0;

          svg:first-of-type {
            width: 28px;
            height: 28px;
          }
        }

        &.w-e-bar-item-group {
          .w-e-bar-item-menus-container {
            margin-top: -28px;
            padding: 3px;

            button svg {
              width: 18px;
              height: 18px;
            }
          }
        }

        &:nth-of-type(2) {
          margin-left: 8px;
        }
      }
    }

    .extra_box {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-left: 8px;

      .send_btn {
        width: 64px;
        background: #ffffff;
        border-radius: 3px;
        border: 1px solid #0052d9;
        font-size: 12px;
        color: #0052d9;
        line-height: 20px;
        padding: 2px 8px;
      }
    }
  }
}
</style>
