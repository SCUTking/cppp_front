<template>
  <div style="width: 100%">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue';
import WEditor, { curToolbarConfig } from 'wangeditor';
import { message } from 'ant-design-vue';

const { proxy } = getCurrentInstance();

const props = defineProps({
    inputValue: { type: String },
  }),
  editor = ref(null),
  editorContent = ref(null);

watch(props.inputValue, (val) => {
  console.log(val);
  editorContent.value = val;
  editor.value.txt.html(val);
});

onMounted(() => {
  initEditor();
  console.log(curToolbarConfig);
});

const baseUrl = '';
const emits = defineEmits(['change']);
const initEditor = () => {
    // const that = this
    editor.value = new WEditor(proxy.$refs.editor);

    editor.value.config.height = 500; // 设置编辑区域的高度500px
    editor.value.config.placeholder = '请输入'; // 设置空状态下提示文本
    editor.value.config.menuTooltipPosition = 'down'; // 设置菜单栏提示为上标还是下标 'up' or 'down'

    editor.value.config.onchange = (html) => {
      console.log(html);
      // 设置编辑区变化监听回调
      emits('change', html);
    };

    editor.value.config.customAlert = function (s, t) {
      // 自定义 alert
      switch (t) {
        case 'success':
          message.success(s);
          break;
        case 'info':
          message.info(s);
          break;
        case 'warning':
          message.warning(s);
          break;
        case 'error':
          message.error(s);
          break;
        default:
          message.info(s);
          break;
      }
    };

    editor.value.config.excludeMenus = ['emoticon', 'video', 'link']; // 配置菜单栏，设置不需要的菜单 去掉了emoji表情、视频、链接
    editor.value.config.showFullScreen = true; // 配置全屏功能

    editor.value.config.uploadImgServer = `${baseUrl}/api/upload/upload`; // 配置接口
    // 接口返回格式十分重要 要与后端约定 文档地址 https://www.wangeditor.com/doc/pages/07-%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87/01-%E9%85%8D%E7%BD%AE%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%8E%A5%E5%8F%A3.html

    // 限制图片大小和类型
    editor.value.config.uploadImgAccept = []; // 不限制
    editor.value.config.uploadImgMaxSize = 5 * 1024 * 1024; // 5M
    editor.value.config.uploadImgMaxLength = 3; // 一次最多上传 3 个图片
    editor.value.config.uploadFileName = 'file'; // 自定义 fileName
    editor.value.config.uploadImgTimeout = 15 * 1000; // 上传接口等待的最大时间

    editor.value.config.showLinkImg = false; // 隐藏插入网络图片

    editor.value.config.uploadImgHooks = {
      // 上传图片之前
      before: function (xhr) {
        console.log(xhr);

        // 可阻止图片上传
        return {
          prevent: false,
          msg: '需要提示给用户的错误信息',
        };
      },
      // 图片上传并返回了结果，图片插入已成功
      success: function (xhr) {
        console.log('success', xhr);
        message.success('插入成功');
      },
      // 图片上传并返回了结果，但图片插入时出错了
      fail: function (xhr, editor, resData) {
        console.log('fail', resData);
        message.error('插入失败');
      },
      // 上传图片出错，一般为 http 请求的错误
      error: function (xhr, editor, resData) {
        console.log('error', xhr, resData);
        message.error('http请求的错误');
      },
      // 上传图片超时
      timeout: function (xhr) {
        console.log('timeout');
        message.error('上传图片超时');
      },
      // 图片上传并返回了结果，想要自己把图片插入到编辑器中
      // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
      customInsert: function (insertImgFn, res) {
        console.log(insertImgFn, res);
        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        if (res.code === 0) {
          // 上传成功，返回图片链接
          insertImgFn(baseUrl + res.data.url);
        } else {
          // 上传失败，返回错误信息
          message.error(res.msg);
        }
        // insertImgFn(baseUrl + result.data.url)
      },
    };
    /*
      上传接口额外参数 选用
      editor.config.uploadImgParams = {
        token: 'xxxxx',
        x: 100
      }
      上传接口额外请求头 选用
      editor.config.uploadImgHeaders = {
        Accept: 'text/x-json',
        a: 100,
      }
      参数拼接到 url 中
      editor.config.uploadImgParamsWithUrl = true
      */

    /*
      从其他地方（如网页、word 等）复制文本到编辑器中，编辑器会默认过滤掉复制文本的样式，
      这样可以让编辑器内容更加简洁。因为复制过来的文本样式，可能会比较混乱，且不可控。
      可通过设置 editor.config.pasteFilterStyle = false 来关闭样式过滤。
      editor.config.pasteFilterStyle = false

      从其他页面（如网页、word 等）复制过来的内容，除了包含文字还可能包含图片，
      这些图片一般都是外域的（可能会有防盗链处理，导致图片不显示）。
      可以通过配置 editor.config.pasteIgnoreImg = true 来忽略粘贴的图片。
      如果复制的内容有图片又有文字，则只粘贴文字，不粘贴图片。
      */

    editor.value.create();
    editorContent.value = props.inputValue;
    editor.value.txt.html(props.inputValue);
  },
  clear = () => {
    editor.value.txt.clear();
  };

onBeforeUnmount(() => {
  // 销毁编辑器
  editor.value.destroy();
  editor.value = null;
});
</script>
