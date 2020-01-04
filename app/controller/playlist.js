'use strict';

const Controller = require('egg').Controller;

const rules = {
    index: {
        page: { type: 'string', required: false, trim: true },
        pageSize: { type: 'string', required: false, trim: true },
    },
    edit: {
        id: { type: 'string', required: true, trim: true },
    },
    update: {
        id: { type: 'string', required: true, trim: true },
        name: { type: 'string', required: true, min: 2, max: 20, trim: true },
        copywriter: { type: 'string', required: true, min: 2, max: 40, trim: true },
    },
};


class PlaylistController extends Controller {
    /**
     * 获取歌单列表 GET /api/v1/playlist?page=1&pageSize=10
     */
    async index() {
        const { ctx } = this;
        ctx.validate(rules.index, ctx.query);
        const data = await ctx.service.playlist.index(ctx.query);
        this.ctx.helper.returnSuccessBody(ctx, data);
    }

    /**
     * 根据_id获取单个歌单详情 GET /api/v1/playlist/0b85a0f35e0e8401011f3fc15b5f6f68/edit
     * 这种方式 在 this.ctx.parmas里面获取参数
     */
    async edit() {
        const { ctx } = this;
        ctx.validate(rules.edit, ctx.params);
        const data = await ctx.service.playlist.edit(ctx.params.id);
        this.ctx.helper.returnSuccessBody(ctx, data);
    }
    /**
     * 根据_id修改歌单的name和copywriter属性 PUT /api/v1/playlist/0b85a0f35e0e8401011f3fc15b5f6f68
     */
    async update() {
        const { ctx } = this;
        const params = {
            id: ctx.params.id,
            ...ctx.request.body,
        };
        ctx.validate(rules.update, params);
        const data = await this.service.playlist.update(params);
        this.ctx.helper.returnSuccessBody(ctx, data);
    }

    /**
     * 根据_id删除歌单 DELETE /api/v1/playlist/0b85a0f35e0e8401011f3fc15b5f6f68
     */
    async destroy() {
        const { ctx } = this;
        ctx.validate(rules.edit, ctx.params);
        const data = await this.service.playlist.destroy(ctx.params.id);
        this.ctx.helper.returnSuccessBody(ctx, data);
    }
}

module.exports = PlaylistController;
