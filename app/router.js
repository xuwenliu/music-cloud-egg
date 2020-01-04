'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const baseRouter = app.config.baseRouter; // /api/v1

    // RESTful 风格的 URL 定义
    router.resources('playlist', baseRouter + '/playlist', controller.playlist);
    // router.get('/api/v1/playlist/:id/edit', controller.playlist.edit);
    // router.put('/api/v1/playlist/:id', controller.playlist.update);
    // router.del('/api/v1/playlist/:id', controller.playlist.destroy);
    // router.get('/api/v1/playlist', controller.playlist.index);
    router.resources('swiper', baseRouter + '/swiper', controller.swiper);
};
