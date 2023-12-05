/*
 * @Date: 2023-02-14 09:56:13
 * @LastEditTime: 2023-02-14 10:34:35
 */
const webpackContext = require.context('./modules/', true, /\.js$/);

let apis = {};
webpackContext.keys().map((item) => {
  const defaultModule = webpackContext(item).default;
  apis = Object.assign(apis, defaultModule);
});

export default apis;
