/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
       * built-in config
       * @type {Egg.EggAppConfig}
       **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1577755030878_5427';


    // add your middleware config here
    // 加载 errorHandler 中间件
    config.middleware = [ 'errorHandler' ];
    // 只对 /api 前缀的 url 路径生效
    config.errorHandler = {
        match: '/api',
    };


    // add your user config here
    // 把一些公共的配置设置在这里
    const userConfig = {
        baseRouter: '/api/v1', // 基本路由
        appId: 'wx34627484a364af57', // 小程序的appId
        secret: '1ddc2307897eb9921f1be23ba87b8e3c', // 小程序的secret
        cloud_env: 'test-r9fav', // 云开发环境ID
    };


    // 上传文件需开启
    config.multipart = {
        mode: 'file',
    };


    // post请求忽略csrf
    config.security = {
        csrf: {
            enable: false,
        },
    };

    return {
        ...config,
        ...userConfig,
    };
};
