/*
 * @Date: 2023-02-14 09:56:14
 * @LastEditTime: 2023-02-15 09:41:21
 */
const webpackContext = require.context('./modules/', true, /\.js$/);
const appRoutes = [];

webpackContext.keys().map((item) => {
  const defaultModule = webpackContext(item).default;
  if (!defaultModule) return;
  const moduleList = Array.isArray(defaultModule)
    ? [...defaultModule]
    : [defaultModule];
  appRoutes.push(...moduleList);
});

export default appRoutes;
