/*
 * @Date: 2023-05-09 15:13:20
 * @LastEditTime: 2023-07-12 15:02:46
 */
import browserList from '../config/browserList';

const getBrowserVersion = (browserType, UserAgent) => {
  let versions = '';

  switch (browserType.toLowerCase()) {
    case 'ie':
      versions = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2];
      break;
    case 'chrome':
      for (let mt in navigator.mimeTypes) {
        //360 pc
        if (navigator.mimeTypes[mt]['type'] == 'application/360softmgrplugin')
          browserType = '360';
      }
      versions = UserAgent.match(/chrome\/([\d.]+)/)[1];
      break;

    case 'firefox':
      versions = UserAgent.match(/firefox\/([\d.]+)/)[1];
      break;
    case 'opera':
      versions = UserAgent.match(/opera\/([\d.]+)/)[1];
      break;
    case 'safari':
      versions = UserAgent.match(/version\/([\d.]+)/)[1];
      break;
    case 'edg':
    case 'edge':
      versions = UserAgent.match(/edg\/([\d.]+)/)[1];
      break;
    case 'qqbrowser':
      versions = UserAgent.match(/qqbrowser\/([\d.]+)/)[1];
      break;
  }

  return parseInt(versions);
};

const getBrowser = () => {
  const UserAgent = navigator.userAgent.toLowerCase();
  const browserInfo = { isChrome: UserAgent.indexOf('chrome') > -1 };

  if (UserAgent.indexOf('micromessenger') != -1) browserInfo.isChrome = false;

  const browserObj = {
    Chrome:
      UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1,
    Firefox: UserAgent.indexOf('firefox') > -1,
    Opera: UserAgent.indexOf('opera') > -1,
    Safari:
      UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1,
    Edge: UserAgent.indexOf('edg') > -1,
    QQBrowser: /qqbrowser/.test(UserAgent),
    WeixinBrowser: /MicroMessenger/i.test(UserAgent),
  };

  // 筛选出为false的浏览器内核
  for (let key in browserObj) {
    if (!browserObj[key]) delete browserObj[key];
  }

  if (Object.keys(browserObj).length > 1 && browserObj.hasOwnProperty('Chrome'))
    delete browserObj['Chrome'];

  for (let key in browserObj) {
    if (browserObj.hasOwnProperty(key) && browserObj[key]) {
      browserInfo.browser = key;
      browserInfo.versions = getBrowserVersion(key, UserAgent);
      break;
    }
  }
  return browserInfo;
};

const browserAcomputer = () => {
  const { device, browser, version, system, systemVersion, platform } =
      require('browser-tool')(),
    { width, height, availWidth, availHeight } = window.screen,
    { clientWidth, clientHeight, scrollLeft, scrollTop } =
      document.documentElement,
    displayResolution = {
      screen: { width, height, availWidth, availHeight },
      document: { clientWidth, clientHeight, scrollLeft, scrollTop },
    };

  return {
    browser: {
      type: browser,
      lowest: browserList[browser],
      browserVersion: `${browser} ${version}`,
      version,
    },
    system: {
      systemVersion: `${system} ${systemVersion}`,
      ua: navigator.userAgent.toLowerCase(),
      displayResolution,
      device,
      system,
      platform,
    },
  };
};

const browserRealease = () => {
  const { browser, system: systemInfo } = browserAcomputer(),
    { lowest, type, version } = browser,
    { device, ua, system } = systemInfo;

  const params = {
    isPc: device.toLocaleLowerCase() == 'pc',
    isAllowedUse: Object.keys(browserList).includes(type),
    isNeededUpdate: Number(version.split('.')[0]) < browserList[type],
    lowestVersions: lowest,
    version,
  };

  if (system.toLocaleLowerCase() == 'windows')
    params.win = {
      isXp: ua.indexOf('windows nt 5.1') !== -1,
      isWin7: ua.indexOf('windows nt 6.1') !== -1,
      isX64: ua.indexOf('windows nt 6.1') !== -1 && ua.indexOf('win64') !== -1,
    };

  return params;
};

export { browserAcomputer, browserRealease };
