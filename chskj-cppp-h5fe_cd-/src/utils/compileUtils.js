import * as api from '@/api';

// 运行c++python代码
export function handleCompile({
  stuId,
  paperId,
  compileId,
  langName,
  code,
  input,
}) {
  return new Promise((resolve) => {
    api.default
      .getCompileResult({ stuId, paperId, compileId, langName, code, input })
      .then((res) => {
        if (res.resultCode == 200) resolve(res);
      });
  });
}

// 自由练习c++python代码
export function handleFreeCompile({ langName, code, input }) {
  return new Promise((resolve) => {
    api.default.getFreeCompileResult({ langName, code, input }).then((res) => {
      if (res.resultCode == 200) resolve(res);
    });
  });
}

// 提交编译题
export function getCompileAnswer({
  stuId,
  paperId,
  compileId,
  langName,
  code,
  time,
}) {
  return new Promise((resolve) => {
    api.default
      .getCompileAnswer({ stuId, paperId, compileId, langName, code, time })
      .then((res) => {
        resolve(res);
      });
  });
}
