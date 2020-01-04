'use strict';

const Controller = require('egg').Controller;


const rules = {
    create: {
        filename: { type: 'string', format: new RegExp(/(gif|jpg|jpeg|png|swf)$/, 'i') },
    },
    destory: {
        id: { type: 'string', required: true, trim: true },
    },
};

class SwiperController extends Controller {
    /**
     * 轮播列表 GET /api/v1/swiper
     */
    async index() {
        const { ctx } = this;
        const data = await this.service.swiper.index();
        this.ctx.helper.returnSuccessBody(ctx, data);
    }

    /**
     * 添加轮播图片 POST /api/v1/swiper
     */
    async create() {
        const { ctx } = this;
        const file = ctx.request.files[0];
        ctx.validate(rules.create, {
            filename: file.filename,
        });
        const data = await this.service.swiper.create(file);
        this.ctx.helper.returnSuccessBody(ctx, data);
    }

    /**
     * 删除轮播图片 DELETE /api/v1/swiper/e4d453bf-1805-4fd0-959d-3b2aebb72fac
     */
    async destroy() {
        const { ctx } = this;
        ctx.validate(rules.destory, ctx.params);
        const data = await this.service.swiper.destroy(ctx.params.id);
        this.ctx.helper.returnSuccessBody(ctx, data);
    }

}

module.exports = SwiperController;
