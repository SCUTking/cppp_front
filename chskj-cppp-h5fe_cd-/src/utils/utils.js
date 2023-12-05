/*
 * @Date: 2022-07-11 14:27:16
 * @LastEditTime: 2023-03-15 09:16:49
 */
/**
 * @description: 内容拼接
 * @param {*} data
 * @return {*}
 */
export function parameterChange(data) {
  let res = ``;
  for (const key in data) {
    let dataKey = '';
    if (data[key] || data[key] === 0) dataKey = data[key];
    res = `${res}&${key}=${dataKey}`;
  }
  return res.substr(1);
}

// 复制文本
export function copyText(text) {
  return new Promise((resolve) => {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // 使其在视口之外
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    resolve();
  });
}

// 将阿拉伯数字转为汉字;
export function convertToChineseNumeral(num) {
  if (num == 10) {
    return '十';
  } else if (num == 1) {
    return '一';
  }
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千', '万'];
  let result = '';
  let numStr = num.toString();
  for (let i = 0; i < numStr.length; i++) {
    let digit = parseInt(numStr.charAt(i));
    let unit = units[numStr.length - i - 1];
    if (digit === 0) {
      // 当前数字为0时不需要输出汉字，但需要考虑上一个数字是否为0，避免出现连续的零
      if (result.charAt(result.length - 1) !== '零') {
        result += '零';
      }
    } else {
      result += digits[digit] + unit;
    }
  }
  // 对于一些特殊的数字，如10、100等，需要在最前面加上“一”
  if (result.charAt(0) === '一') {
    result = result.substr(1, result.length);
  } else if (result.charAt(0) === '百') {
    result = '一' + result;
  } else if (result.charAt(0) === '千') {
    result = '一' + result;
  }
  return result;
}
