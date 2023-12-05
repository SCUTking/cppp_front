/*
 * @Date: 2023-02-24 10:07:14
 * @LastEditTime: 2023-08-01 17:18:44
 */
import { request } from '@/request/request';
import { parameterChange } from '@/utils';

export default {
  // 获取所有课类信息
  getAllCourseClassAndCourseInfo(data) {
    return request({
      url:
        '/course/course-class/getAllCourseClassAndCourseInfo?' +
        parameterChange(data),
      method: 'get',
    });
  },

  // 获取所有课类
  getAllCourseClass(data) {
    return request({
      url: '/course/getAllCourseClass',
      method: 'post',
      data,
    });
  },

  // 获取课程、下属单元及课次信息
  getCourseInfoWithUnitMessage(data) {
    return request({
      url:
        '/course/course-info/getCourseInfoWithUnitMessage?' +
        parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 根据课次id获取对应知识点
  getCourseKnowledge(data) {
    return request({
      url: '/course/course-knowledge/getChapterKnowledge',
      method: 'post',
      data,
    });
  },

  // 获取题库界面的知识点分类信息（多条件查询）
  getKnowledgeClassifyInfo(data) {
    return request({
      url:
        '/course/knowledge-info/getKnowledgeClassifyInfo?' +
        parameterChange(data),
      method: 'get',
    });
  },

  // 获取一级知识点
  getFKByCcId(data) {
    return request({
      url: '/course/knowledge-info/getFKByCcId?' + parameterChange(data),
      method: 'get',
    });
  },

  // 获取二级知识点
  getSKByFkId(data) {
    return request({
      url: '/course/knowledge-info/getSKByFkId?' + parameterChange(data),
      method: 'get',
    });
  },

  // 获取提问列表数据
  getCommentList(data) {
    return request({
      url: '/course/comment/getCommentList?' + parameterChange(data),
      method: 'get',
    });
  },

  // 获取提问详情列表
  getReplyList(data) {
    return request({
      url: '/course/comment/getReplyList?' + parameterChange(data),
      method: 'get',
    });
  },

  // 获取课次信息（视频与试卷）
  getCourseChapter(data) {
    return request({
      url: '/course/course-chapter/getCourseChapter',
      method: 'post',
      data,
    });
  },

  // 添加提问
  addComment(data) {
    return request({
      url: '/course/comment/addComment',
      method: 'post',
      data,
    });
  },

  // 获取评论列表数据
  getDiscussionComment(data) {
    return request({
      url: '/course/comment/getDiscussionCommment?' + parameterChange(data),
      method: 'get',
    });
  },

  // 添加评论
  addDiscussionComment(data) {
    return request({
      url: '/course/comment/addDiscussionCommment',
      method: 'post',
      data,
    });
  },

  // 评论区上传图片的接口
  uploadImageQ(data) {
    return request({
      url: '/course/comment/uploadImage',
      method: 'post',
      data,
    });
  },

  // 获取推荐课程
  getRecommendCourse(data) {
    return request({
      url: '/course/course-info/getRecommendCourse?' + parameterChange(data),
      method: 'get',
    });
  },

  // 获取推荐课程
  getCourseStatisticsInfo(data) {
    return request({
      url:
        '/course/course-info/getCourseStatisticsInfo?' + parameterChange(data),
      method: 'get',
    });
  },

  // 保存课堂练习的代码
  saveStudentWork(data) {
    return request({
      url: '/course/student-work/saveStudentWork',
      method: 'post',
      data,
    });
  },

  // 获取学生的作品集
  getStudentWork(data) {
    return request({
      url: '/course/student-work/getStudentWork?' + parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 我的代码集下载文件
  downloadStudentWork(data) {
    return request({
      url: '/course/student-work/downloadStudentWork?' + parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 删除学生代码作品
  deleteStudentWork(data) {
    return request({
      url: '/course/student-work/deleteStudentWork?' + parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 获取代码集详细信息
  getStudentWorkById(data) {
    return request({
      url: '/course/student-work/getStudentWorkById?' + parameterChange(data),
      method: 'get',
    });
  },

  // 获取学生已购买课程的学习进度
  getAllCourseStudySchedule(data) {
    return request({
      url:
        '/course/course-info/getAllCourseStudySchedule?' +
        parameterChange(data),
      method: 'get',
    });
  },
};
