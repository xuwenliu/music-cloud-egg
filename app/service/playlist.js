'use strict';
const Service = require('egg').Service;

class PlaylistService extends Service {
    async index(params) {
        const res = await this.ctx.helper.callCloudFn('music', {
            $url: 'playlist',
            page: params.page * 1,
            pageSize: params.pageSize * 1,
        });
        this.ctx.helper.checkSuccess(res);
        return JSON.parse(res.resp_data);
    }
    async edit(id) {
        const query = `db.collection('playlist').doc('${id}').get()`;
        const res = await this.ctx.helper.callCloudDB('databasequery', query);
        this.ctx.helper.checkSuccess(res);
        return res.data.length > 0 ? JSON.parse(res.data[0]) : {};
    }
    async update(params) {
        const query = `
            db.collection('playlist').doc('${params.id}').update({
                data:{
                    name:'${params.name}',
                    copywriter:'${params.copywriter}'
                }
            })
        `;
        const res = await this.ctx.helper.callCloudDB('databaseupdate', query);
        this.ctx.helper.checkSuccess(res);
        return {
            matched: res.matched,
            modified: res.modified,
            id: res.id,
        };
    }

    async destroy(id) {
        const query = `db.collection('playlist').doc('${id}').remove()`;
        const res = await this.ctx.helper.callCloudDB('databasedelete', query);
        this.ctx.helper.checkSuccess(res);
        return {
            deleted: res.deleted,
        };
    }
}

module.exports = PlaylistService;
