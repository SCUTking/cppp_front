<template>
  <div ref="modalRef">
    <a-modal
      v-model:visible="visible"
      :closable="false"
      :destroyOnClose="true"
      :footer="null"
      :getContainer="() => $refs.modalRef"
      @cancel="onClose"
    >
      <p class="title">保存至“我的作品&代码集”</p>

      <img
        src="@/assets/learn/close.png"
        alt="close"
        class="close_btn"
        @click="visible = false"
      />

      <p class="tips">
        * 请填写文件名称后并选择所属课类后确认保存，将用于后续课程学习等场景中。
      </p>

      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item label="文件名称" name="workName">
          <a-input
            v-model:value="formState.workName"
            placeholder="请输入文件名称"
          />
          <p class="input_tips">
            文件名称最多20个中文字符 {{ formState.workName.length }}/20
          </p>
        </a-form-item>
        <a-form-item label="所属课类" name="langName">
          <a-select v-model:value="formState.langName">
            <a-select-option
              v-for="item in options"
              :key="item.key"
              :value="item.value"
              >{{ item.key }}</a-select-option
            >
          </a-select>
        </a-form-item>

        <a-space>
          <a-button type="primary" @click="save">确认保存</a-button>
          <a-button @click="visible = false">暂不保存</a-button>
        </a-space>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store';
import { ref, reactive, getCurrentInstance, toRef } from 'vue';

const { proxy } = getCurrentInstance(),
  userStore = useUserStore();

const props = defineProps({
  language: String,
  saveName: String,
  compileCode: String,
  compileOutput: String,
  scratchSave: String,
  ccId: String,
});

const compileCode = toRef(props, 'compileCode'),
  language = toRef(props, 'language'),
  compileOutput = toRef(props, 'compileOutput'),
  scratchSave = toRef(props, 'scratchSave'),
  ccId = toRef(props, 'ccId'),
  saveName = toRef(props, 'saveName');

const visible = ref(false),
  open = () => {
    const scratchOption = [{ key: 'Scratch', value: 'scratch' }],
      otherOptions = [
        { key: 'C++', value: 'cpp' },
        { key: 'Python', value: 'python' },
      ];
    options.value =
      props.language.toLowerCase() == 'scratch' ? scratchOption : otherOptions;

    if (saveName?.value) formState.value.workName = saveName.value;
    if (language?.value) formState.value.langName = language.value;

    visible.value = true;
  };

const formState = ref({ workName: '', langName: undefined }),
  options = ref([]),
  save = () => {
    const form = {
      ...formState.value,
      stuId: userStore.userInfo.stuId,
      ccId: ccId.value,
      compileCode: compileCode.value ?? '',
      compileOutput: compileOutput.value ?? '',
      scratchSave: scratchSave.value ?? '',
      timeCost: 0,
      memoryCost: 0,
    };

    if (!form.workName) {
      proxy.$message.warning('文件名称不能为空！');
      return;
    }

    const regex = /\./; // 正则表达式匹配点号（.）
    if (regex.test(form.workName)) {
      proxy.$message.warning('检测到非法字符！');
      return;
    }

    proxy.$api
      .saveStudentWork(form)
      .then((res) => {
        if (res.resultCode == 200) {
          proxy.$message.info(res.resultMsg);
          visible.value = false;
        }
      })
      .finally(() => {
        formState.value.workName = '';
      });
  };

defineExpose({ open });
</script>

<style lang="less" scoped>
:deep(.ant-modal) {
  width: 542px !important;
  height: fit-content !important;
  min-height: 332px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.302);
  padding: 0;

  .ant-modal-content {
    width: 100%;
    height: 100%;

    .ant-modal-body {
      width: 100%;
      height: 100%;
      padding: 0 16px 32px 16px;
      box-sizing: border-box;
      position: relative;

      .close_btn {
        width: 24px;
        height: 24px;
        position: absolute;
        top: 12px;
        right: 16px;
        cursor: pointer;
      }

      .title {
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        font-weight: 600;
        color: #3d3d3d;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .tips {
        width: 100%;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 22px;
        margin-top: 16px;
      }

      .ant-form {
        margin-top: 16px;
        padding-left: 7px;

        .ant-form-item {
          margin-bottom: 16px;

          .ant-form-item-label {
            width: 80px;
            text-align: left;
          }

          .ant-form-item-control-input {
            width: 280px;
          }

          .ant-select-selector {
            padding: 5px 8px;
            align-items: center;

            span.ant-select-selection-placeholder {
              height: 30px;
            }
          }

          .input_tips {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.4);
            line-height: 20px;
          }
        }

        .ant-space {
          width: 100%;
          justify-content: flex-end;
          margin-top: 50px;
        }
      }
    }
  }
}
</style>
