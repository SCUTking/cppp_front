import { request } from '@/request/request';
import { parameterChange } from '@/utils';

export default {
  // 获取客观题题目
  getObjInfoByPaperId(data) {
    return request({
      url:
        '/practice/tbl-paper-info/getObjInfoByPaperId?' + parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 获取编译题题目
  getCompileInfoByPaperId(data) {
    return request({
      url:
        '/practice/tbl-program-info/getCompileInfoByPaperId?' +
        parameterChange(data),
      method: 'post',
      data,
    });
  },

  // 获取操作题题目
  getOperateInfoByPaperId(data) {
    return request({
      url:
        '/practice/tbl-operate-info/getOperateInfoByPaperId?' +
        parameterChange(data),
      method: 'post',
      data,
    });
  },

  // 保存试卷做题记录（非提交）
  savePaperRecords(data) {
    return request({
      url: '/practice/tbl-paper-info/savePaperRecords',
      method: 'post',
      data,
    });
  },

  // 获取试卷做题记录
  getPaperRecords(data) {
    return request({
      url: '/practice/tbl-paper-info/getPaperRecords?' + parameterChange(data),
      method: 'post',
      data,
    });
  },
  // 获取答题卡
  getAnswerCard(data) {
    return request({
      url: '/practice/tbl-exam-result/getAnswerCard?' + parameterChange(data),
      method: 'get',
      data,
    });
  },
  // 提交全部客观题
  judgeAnswer(query, data) {
    return request({
      url: '/practice/tbl-obj-answer/judgeAnswer?' + parameterChange(query),
      method: 'post',
      data,
    });
  },

  // 运行c++/python代码
  getCompileResult(data) {
    return request({
      url: '/practice/tbl-program-answer/getCompileResult',
      method: 'post',
      data,
    });
  },

  // 自由练习c++python代码
  getFreeCompileResult(data) {
    return request({
      url: '/practice/tbl-program-answer/getFreeCompileResult',
      method: 'post',
      data,
    });
  },

  // 提交编译题
  getCompileAnswer(data) {
    return request({
      url: '/practice/tbl-program-answer/getCompileAnswer',
      method: 'post',
      data,
    });
  },

  // 提交操作题
  getScratchAnswer(data) {
    return request({
      url: '/practice/tbl-operate-answer/getScratchAnswer',
      method: 'post',
      data,
    });
  },

  // 创建考试统计结果
  createExamResult(data) {
    return request({
      url: '/practice/tbl-exam-result/createExamResult',
      method: 'post',
      data,
    });
  },

  // 获取统计结果
  getExamResult(data) {
    return request({
      url: '/practice/tbl-exam-result/getExamResult?' + parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 个人中心--获取错题
  getWrongPaperList(data) {
    return request({
      url:
        '/practice/tbl-paper-info/getWrongPaperList?' + parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 获取筛选试卷
  getPageListWithAllCondition(data) {
    return request({
      url:
        '/practice/tbl-paper-info/getPageListWithAllCondition?' +
        parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 获取练习题库--刷题统计的信息
  getDoneObjStatisticInfo(data) {
    return request({
      url:
        '/practice/tbl-student-paper/getDoneObjStatisticInfo?' +
        parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 获取试卷关键信息
  getPaperWaitingMsg(data) {
    return request({
      url:
        '/practice/tbl-paper-info/getPaperWaitingMsg?' + parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 获取学生paper的状态
  getPaperStatus(data) {
    return request({
      url: '/practice/tbl-paper-info/getPaperStatus?' + parameterChange(data),
      method: 'get',
      data,
    });
  },

  // 获取系统当前时间
  getAccess() {
    return request({
      url: '/user/stuInfo/getAccess',
      method: 'get',
    });
  },

  // 保存代码
  saveCompileCode(data) {
    return request({
      url: '/practice/tbl-program-answer/saveCompileCode',
      method: 'post',
      data,
    });
  },

  // 获取代码
  getSavedCompileCode(data) {
    return request({
      url: '/practice/tbl-program-answer/getSavedCompileCode',
      method: 'post',
      data,
    });
  },
  // 保存scratch文件
  saveScratchAnswer(data) {
    return request({
      url: '/practice/tbl-operate-answer/saveScratchAnswer',
      method: 'post',
      data,
    });
  },
  // 获取scratch文件
  getScratchAnswerInfo(data) {
    return request({
      url: '/practice/tbl-operate-answer/getScratchAnswerInfo',
      method: 'post',
      data,
    });
  },
};
