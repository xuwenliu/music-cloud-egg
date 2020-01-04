# music-cloud-egg



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

### 所有工具函数编写在app/extend/helper.js

### 使用微信开发util函数 
[wx-js-utils](https://github.com/lcxfs1991/wx-js-utils)

### 使用egg自带的ctx.curl(url,options)发送请求，额外使用request request-promise 请求

### RESTful 风格的URL定义 [RESTful](https://eggjs.org/zh-cn/basics/router.html#restful-%E9%A3%8E%E6%A0%BC%E7%9A%84-url-%E5%AE%9A%E4%B9%89)
```
router.resources('playlist', '/api/playlist', controller.playlist);
// router.get('/api/playlist', controller.playlist.index);
// router.get('/api/playlist/:id/edit', controller.playlist.edit);
// router.put('/api/playlist/:id', controller.playlist.update);
// router.del('/api/playlist/:id', controller.playlist.destroy);
router.resources('swiper', '/api/swiper', controller.swiper);
```

### egg开发注意
- config/config.default.js 配置公共数据
```
const userConfig = {
    appId: 'wx34627484a364af57', // 小程序的appId
    secret: '1ddc2307897eb9921f1be23ba87b8e3c', // 小程序的secret
    cloud_env: 'test-r9fav', // 云开发环境ID
};
```
- 上传文件需要开启如下配置
```
config.multipart = {
    mode: 'file',
};
```
- post请求默认开启csrf安全机制，需要关闭 
```
config.security = {
    csrf: {
        enable: false
    },
};
```
