'use strict';

const Service = require('egg').Service;

class SwiperService extends Service {
    async index() {
        const query = "db.collection('swiper').get()";
        const res = await this.ctx.helper.callCloudDB('databasequery', query);
        this.ctx.helper.checkSuccess(res);
        const data = res.data;
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                data[i] = JSON.parse(data[i]);
            }
        }
        return data;
    }
    async create(file) {
        // 1.需要做上传数量限制

        // 2.先上传到云存储
        const fileid = await this.ctx.helper.upload(file);
        // 3.再写入到云数据库
        const query = `
            db.collection('swiper').add({
                data:{
                    fileid:'${fileid}'
                }
            })
        `;
        const res = await this.ctx.helper.callCloudDB('databaseadd', query);
        this.ctx.helper.checkSuccess(res);
        return {
            id_list: res.id_list,
        };
    }

    async destroy(id) {

        // 1.根据id先查询出fileid
        const query = `db.collection('swiper').doc('${id}').get()`;
        const getDBRes = await this.ctx.helper.callCloudDB('databasequery', query);
        const fileid = getDBRes.data.length > 0 ? JSON.parse(getDBRes.data[0]).fileid : '';

        // 2.删除云数据库中的数据
        const removeQuery = `db.collection('swiper').doc('${id}').remove()`;
        const delDBRes = await this.ctx.helper.callCloudDB('databasedelete', removeQuery);

        // 3.删除云存储中的文件
        await this.ctx.helper.deleteFile([ fileid ]);

        this.ctx.helper.checkSuccess(delDBRes);
        return {
            deleted: delDBRes.deleted,
        };
    }
}

module.exports = SwiperService;
