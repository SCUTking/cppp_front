/*
 * @Date: 2023-02-24 10:07:14
 * @LastEditTime: 2023-08-02 15:07:16
 */
import { request } from '@/request/request';
import { parameterChange } from '@/utils';

export default {
  // 获取验证码
  uuid(data) {
    return request({
      url: '/user/auth/uuid',
      method: 'get',
      data,
    });
  },

  // 登录
  login(data) {
    return request({
      url: '/user/auth/login',
      method: 'post',
      data,
    });
  },

  // 学生注册
  register(data) {
    return request({
      url: '/user/auth/register',
      method: 'post',
      data,
    });
  },

  // 修改密码
  changePassWord(data) {
    return request({
      url: '/user/auth/changePassWord',
      method: 'post',
      data,
    });
  },

  // 忘记密码
  updatePassWord(data) {
    return request({
      url: '/user/auth/updatePassWord',
      method: 'post',
      data,
    });
  },

  // 发送短信验证码
  sendSms(data) {
    return request({
      url: '/user/auth/sendSms',
      method: 'post',
      data,
    });
  },

  // 查询学生信息
  getStuInfo(data) {
    return request({
      url: '/user/stuInfo/getStuInfo',
      method: 'get',
    });
  },

  // 上传头像
  uploadAvatar(data) {
    return request({
      url: '/user/stuInfo/uploadAvatar',
      method: 'post',
      data,
    });
  },

  // 修改学生基础信息
  updateStuInfo(data) {
    return request({
      url: '/user/stuInfo/updateStuInfo',
      method: 'post',
      data,
    });
  },

  // 验证手机号
  verifyPhone(data) {
    return request({
      url: '/user/auth/verifyPhone',
      method: 'post',
      data,
    });
  },

  // 绑定新手机号
  updatePhone(data) {
    return request({
      url: '/user/auth/updatePhone',
      method: 'post',
      data,
    });
  },

  // 发送邮箱验证码
  sendEmail(data) {
    return request({
      url: '/user/auth/sendEmail',
      method: 'post',
      data,
    });
  },

  // 绑定邮箱
  bindEmail(data) {
    return request({
      url: '/user/auth/bindEmail',
      method: 'post',
      data,
    });
  },

  // 学习管理---我的课程
  getMyCourseChapter(data) {
    return request({
      url: '/user/student-course/getMyCourseChapter?' + parameterChange(data),
      method: 'get',
    });
  },

  // 插入某课次的学习记录（学生第一次点入某课次时需调用）
  insertStudentChapter(data) {
    return request({
      url: '/user/student-chapter/insertStudentChapter',
      method: 'post',
      data,
    });
  },

  // 更新学生的课次学习情况（看视频）
  updateWatchVideoStudyState(data) {
    return request({
      url: '/user/student-chapter/updateWatchVideoStudyState',
      method: 'post',
      data,
    });
  },

  // 更新学习课次状态（做作业）
  updateDoObjStudyState(data) {
    return request({
      url: '/user/student-chapter/updateDoObjStudyState',
      method: 'post',
      data,
    });
  },

  // 获取一级（省）
  getFirstCodes(data) {
    return request({
      url: '/user/area-info/getFirstCodes',
      method: 'get',
      data,
    });
  },

  // 获取二级（市）
  getAreaInfoByFirstCode(data) {
    return request({
      url: '/user/area-info/getAreaInfoByFirstCode?' + parameterChange(data),
      method: 'get',
    });
  },

  // 获取三级（区）
  getAreaInfoBySecondCode(data) {
    return request({
      url: '/user/area-info/getAreaInfoBySecondCode?' + parameterChange(data),
      method: 'get',
    });
  },

  // 请求二维码
  bindWx(data) {
    return request({
      url: '/user/auth/bindWx',
      method: 'post',
      data,
    });
  },

  // 获取微信相关信息
  getWxInfo(data) {
    return request({
      url: '/user/auth/getWxInfo?' + parameterChange(data),
      method: 'get',
    });
  },

  // 绑定openid
  bindOpenId(data) {
    return request({
      url: '/user/auth/bindOpenId?' + parameterChange(data),
      method: 'post',
    });
  },

  // 解除绑定微信
  unbindWx(data) {
    return request({
      url: '/user/auth/unbindWx',
      method: 'post',
      data,
    });
  },
};
