<template>
  <div class="personal_info">
    <p class="title">个人信息</p>

    <a-form :model="form" autocomplete="off" @finish="onSubmit">
      <a-form-item label="个人头像" name="avatar">
        <div class="flex_box">
          <div class="avatar_box">
            <img
              :src="
                form.avatar ??
                'https://tdesign.gtimg.com/miniprogram/images/avatar1.png'
              "
              alt="avatar"
            />
            <a-upload
              name="file"
              :action="`${VUE_APP_API_URL}/user/stuInfo/uploadAvatar`"
              :before-upload="beforeUpload"
              :headers="headers"
              @change="handleChange"
            >
              <span class="edit_avatar">编辑头像</span>
            </a-upload>
          </div>
          <span class="avatar_tips"
            >仅支持JPG、PNG、JPEG格式，文件不可大于2M</span
          >
        </div>
      </a-form-item>
      <a-form-item label="平台昵称" name="nickname">
        <a-input
          v-model:value="form.nickname"
          placeholder="请输入昵称，用于课堂交流"
        />
      </a-form-item>
      <a-form-item label="真实姓名" name="stuName">
        <a-input
          v-model:value="form.stuName"
          placeholder="请输入真实姓名，用于报名参加比赛等"
        />
      </a-form-item>
      <a-form-item label="机构/学校" name="belongToUnit">
        <a-input
          v-model:value="form.belongToUnit"
          disabled
          placeholder="机构/学校"
        />
      </a-form-item>
      <a-form-item label="收货地址" name="address">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-select
              placeholder="请选择省份"
              v-model:value="form.province"
              @change="(value) => onSelect(0, value)"
            >
              <a-select-option
                :value="value"
                v-for="(value, key) in province"
                >{{ key }}</a-select-option
              >
            </a-select>
          </a-col>
          <a-col :span="8">
            <a-form-item-rest>
              <a-select
                placeholder="请选择城市"
                v-model:value="form.city"
                @change="(value) => onSelect(1, value)"
              >
                <a-select-option :value="value" v-for="(value, key) in city">{{
                  key
                }}</a-select-option>
              </a-select>
            </a-form-item-rest> </a-col
          ><a-col :span="8">
            <a-form-item-rest>
              <a-select placeholder="请选择区" v-model:value="form.zone">
                <a-select-option
                  :value="value"
                  v-for="(value, key) in district"
                  >{{ key }}</a-select-option
                >
              </a-select>
            </a-form-item-rest>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item-rest>
            <a-textarea
              placeholder="请输入详细收货地址"
              v-model:value="form.detailAddress"
            />
          </a-form-item-rest>
        </a-row>
      </a-form-item>

      <a-button class="save_btn" type="primary" html-type="submit">
        <span>保存</span>
      </a-button>
    </a-form>
  </div>
</template>

<script setup>
import { useCommonStore, useUserStore } from '@/store';
import {
  ref,
  reactive,
  getCurrentInstance,
  toRef,
  watch,
  watchEffect,
  onMounted,
} from 'vue';
const { VUE_APP_API_URL } = process.env;

const { proxy } = getCurrentInstance(),
  userStore = useUserStore(),
  commonStore = useCommonStore();

onMounted(() => {
  emits('onGetUserInfo');
  getFirstCodes();
});

commonStore.s_set_breadcrumb([
  { label: '个人中心' },
  { label: '账号安全' },
  { label: '个人信息' },
]);

const props = defineProps({ userInfo: Object }),
  userInfo = toRef(props, 'userInfo');

// 头像
const headers = {
    authorization: userStore.token,
  },
  handleChange = (info) => {
    const { status, response } = info.file;
    if (status === 'done') form.value.avatar = response.data;
    else if (status === 'error')
      proxy.$message.error(`${info.file.name}上传失败。`);
  },
  beforeUpload = (file) => {
    const { name, type, size } = file;
    const isPic = ['image/png', 'image/jpeg'].includes(type),
      isLessThan2M = size < 2 * 1024 * 1024;

    if (!isPic) proxy.$message.error(`${name}不是JPG、PNG、JPEG格式`);
    if (!isLessThan2M) proxy.$message.error('文件不可大于2M');

    return isPic && isLessThan2M;
  };

const emits = defineEmits(['onGetUserInfo']);
const form = ref({
    avatar: '',
    nickname: '',
    stuName: '',
    province: undefined,
    city: undefined,
    zone: undefined,
    detailAddress: '',
    belongToUnit: '',
  }),
  onSubmit = () => {
    Object.keys(form.value).forEach((val) => {
      if (form.value[val] == undefined) form.value[val] = '';
    });
    proxy.$api.updateStuInfo(form.value).then((res) => {
      if (res.resultCode == 200) {
        proxy.$message.info('修改成功！');
        emits('onGetUserInfo');
      }
    });
  };

// 省市区数据信息
const province = ref([]),
  city = ref([]),
  district = ref({}),
  // 省
  getFirstCodes = () => {
    form.value.city = undefined;
    form.value.zone = undefined;
    proxy.$api.getFirstCodes().then((res) => {
      if (res.resultCode == 200) province.value = res.data;
    });
  },
  // 市
  getAreaInfoByFirstCode = (value) => {
    form.value.city = undefined;
    form.value.zone = undefined;
    proxy.$api.getAreaInfoByFirstCode({ firstCode: value }).then((res) => {
      if (res.resultCode == 200) city.value = res.data;
    });
  },
  // 区
  getAreaInfoBySecondCode = (value) => {
    form.value.zone = undefined;
    proxy.$api.getAreaInfoBySecondCode({ secondCode: value }).then((res) => {
      if (res.resultCode == 200) district.value = res.data;
    });
  },
  onSelect = (type, value) => {
    switch (type) {
      case 0:
        getAreaInfoByFirstCode(value);
        break;
      case 1:
        getAreaInfoBySecondCode(value);
        break;
    }
  };

watch(
  () => userInfo.value,
  (data) => {
    const { avatar, nickname, stuName, province, city, zone, detailAddress } =
      data;

    if (province) getAreaInfoByFirstCode(province);
    if (city) getAreaInfoBySecondCode(city);

    form.value = {
      avatar,
      nickname,
      stuName,
      province: province ? province : undefined,
      city: city ? city : undefined,
      zone: zone ? zone : undefined,
      detailAddress,
    };
    form.value.belongToUnit = '';
    userStore.userInfo.companyInfos.forEach((company, index) => {
      index > 0 ? (form.value.belongToUnit += '/') : '';
      form.value.belongToUnit += company?.companyName ?? '平台用户';
    });
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.personal_info {
  width: 100%;
  height: 674px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 820px 151px 32px;
  box-sizing: border-box;

  .title {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    line-height: 28px;
  }

  :deep(.ant-form) {
    margin-top: 36px;

    .ant-form-item-label {
      width: 128px;

      label {
        color: rgba(0, 0, 0, 0.4);
      }
    }

    .ant-form-item-control {
      margin-left: 16px;

      .ant-form-item-control-input {
        .ant-form-item-control-input-content {
          .flex_box {
            display: flex;
            align-items: flex-start;
          }

          .ant-input-disabled {
            background: #fff !important;
            color: #000 !important;
          }

          .avatar_box {
            width: 80px;
            height: 80px;
            position: relative;
            display: inline-block;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }

            .edit_avatar {
              width: 100%;
              height: 24px;
              line-height: 24px;
              text-align: center;
              font-size: 10px;
              color: #ffffff;
              background: rgba(0, 0, 0, 0.5);
              position: absolute;
              bottom: 0px;
              left: 50%;
              transform: translateX(-50%);
              cursor: pointer;
            }
          }

          .avatar_tips {
            flex: 1;
            height: 22px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.4);
            line-height: 22px;
            display: inline-block;
            margin-left: 16px;
          }

          textarea.ant-input {
            min-height: 54px;
            max-height: 54px;
            resize: none;
          }

          .ant-row:nth-of-type(2) {
            margin-top: 16px;
          }
        }
      }
    }

    .save_btn {
      height: fit-content;
      background: #f2f3ff;
      border-radius: 3px;
      border: 1px solid #0052d9;
      font-size: 16px;
      color: #0052d9;
      line-height: 24px;
      padding: 8px 64px;
      margin-left: 144px;
    }
  }
}
</style>
