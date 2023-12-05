/*
 * @Date: 2021-12-22 11:30:24
 * @LastEditTime: 2023-02-15 09:59:07
 */
import dayjs from 'dayjs';

/**
 * 将时间格式化为时间/月日时间/年月日时间
 * @param {*} time 
 * @returns 
 */
const formatTime = (time) => {
  time = dayjs(time);
  const isSameYear = dayjs().isSame(time, 'year'),
    isSameMonth = dayjs().isSame(time, 'month'),
    isSameDate = dayjs().isSame(time, 'date');

  if (isSameYear && isSameMonth && isSameDate)
    time = dayjs(time).format('HH:mm');
  else if (isSameYear) time = dayjs(time).format('MM/DD HH:mm');
  else time = dayjs(time).format('YYYY/MM/DD HH:mm');

  return time;
};

/**
 * @description: 获取时间
 * @param {*}
 * @return {*} 时间
 */
const getCurrentTime = (time) => {
  const tempTime = time ?? new Date().getTime();
  const date = new Date(tempTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return { date, year, month, day, hour, minute, second };
};

/**
 * @description: 格式化时间日期
 * @param {*} 时间日期
 * @return {*} 时间日期
 */
const formatDateTime = (date, dateJoin = '-', timeJoin = ':') => {
  if (!date) return null;
  const { year, month, day, hour, minute } = getCurrentTime(date1);
  return `${[year, month, day].map(formatNumber).join(dateJoin)} ${[
    hour,
    minute,
  ]
    .map(formatNumber)
    .join(timeJoin)}`;
};

/**
 * @description: 格式化日期
 * @param {*} 日期
 * @return {*} 日期
 */
const formateDate = (date, DateJoin = '-') => {
  const { year, month, day } = getCurrentTime(date);
  return `${[year, month, day].map(formatNumber).join(DateJoin)}`;
};

/**
 * @description: 数字补0
 * @param {*} 数字
 * @return {*} 数字
 */
const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

export {
  formatTime,
  getCurrentTime,
  formatDateTime,
  formateDate,
  formatNumber,
};
