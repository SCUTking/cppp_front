/*
 * @Date: 2022-08-16 09:31:08
 * @LastEditTime: 2023-06-12 17:49:33
 */
import { defineStore } from 'pinia';

const useCommonStore = defineStore('common', {
  state: () => ({
    breadcrumb: [],
    course: {},
    buyLoading: false,
    pcMapName: 'MStudyManage',
    isRegister: false,
    companyLogo: null,
    btnValue: 0,
    defaultName: '暂无昵称',
    defaultAvatar: 'https://cdn.codedancing.cn/cover/defaultAvatar.png',
  }),

  getters: {
    breadcrumbs: (state) => state.breadcrumb,
    courseInfo: (state) => state.course,
  },
  actions: {
    s_set_breadcrumb(breadcrumb) {
      this.breadcrumb = breadcrumb;
    },
    s_set_course(course) {
      this.course = course;
    },
    s_set_buyLoading(isLoading) {
      this.buyLoading = isLoading;
    },
    s_set_pcMapName(pcMapName) {
      this.pcMapName = pcMapName;
      sessionStorage.setItem('pcMapName', pcMapName);
    },
    s_set_is_register(isRegister) {
      this.isRegister = isRegister;
    },
    s_set_company_logo(companyLogo) {
      this.companyLogo = companyLogo;
    },
    s_set_btn_value(btnValue) {
      this.btnValue = btnValue;
      sessionStorage.setItem('btnValue', btnValue);
    },
  },
});

export default useCommonStore;
