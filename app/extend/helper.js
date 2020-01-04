'use strict';
const { WXMINIUser } = require('wx-js-utils');
const fs = require('fs');
const rp = require('request-promise');

module.exports = {
    /**
     * 获取AccessToken
     */
    async getAccessToken() {
        const wxUser = new WXMINIUser({
            appId: this.config.appId,
            secret: this.config.secret,
        });
        return await wxUser.getAccessToken();
    },

    /**
     *
     * @param {云函数名称} fnName
     * @param {调用云函数需要传递的参数} params
     */
    async callCloudFn(fnName, params) {
        const { ctx } = this;
        const ACCESS_TOKEN = await ctx.helper.getAccessToken();
        const options = {
            method: 'POST',
            url: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${this.config.cloud_env}&name=${fnName}`,
            data: params,
            contentType: 'json', // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            dataType: 'json', // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        };
        return (await ctx.curl(options.url, options)).data;
    },

    /**
     *
     * @param {数据库操作名称} fnName
     * @param {数据库操做参数} query
     */

    async callCloudDB(fnName, query = {}) {
        const { ctx, config } = this;
        const ACCESS_TOKEN = await ctx.helper.getAccessToken();
        const options = {
            method: 'POST',
            url: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
            data: {
                query,
                env: config.cloud_env,
            },
            contentType: 'json',
            dataType: 'json',
        };
        return (await ctx.curl(options.url, options)).data;
    },

    /**
     *获取文件临时链接
     * @param {文件fileid Array} file_list
     */
    async download(file_list) {
        const { ctx, config } = this;
        const ACCESS_TOKEN = await ctx.helper.getAccessToken();
        const options = {
            method: 'POST',
            url: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
            data: {
                file_list,
                env: config.cloud_env,
            },
            contentType: 'json',
            dataType: 'json',
        };
        return await ctx.curl(options.url, options);
    },


    /**
     * 上传图片到云存储
     * @param {文件} file
     */
    async upload(file) {
        // 1、获取上传云存储的地址
        const { ctx, config } = this;
        const ACCESS_TOKEN = await ctx.helper.getAccessToken();
        const path = `swiper/${Date.now()}-${Math.random()}-${file.filename}`;
        const options = {
            method: 'POST',
            url: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
            data: {
                path,
                env: config.cloud_env,
            },
            contentType: 'json',
            dataType: 'json',
        };
        const info = (await ctx.curl(options.url, options)).data;

        // 2、上传图片到云存储
        const params = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data',
            },
            uri: info.url, // 第一步返回的url request-promise 要求是uri 不是 url
            formData: {
                key: path,
                Signature: info.authorization,
                'x-cos-security-token': info.token,
                'x-cos-meta-fileid': info.cos_file_id,
                file: fs.createReadStream(file.filepath),
            },
            json: true,
        };
        await rp(params);
        return info.file_id;
    },

    /**
     * 删除云存储的图片文件
     * @param {fileid Array} fileid_list
     */
    async deleteFile(fileid_list) {
        const { ctx, config } = this;
        const ACCESS_TOKEN = await ctx.helper.getAccessToken();
        const options = {
            method: 'POST',
            url: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
            data: {
                env: config.cloud_env,
                fileid_list,
            },
            contentType: 'json',
            dataType: 'json',
        };
        ctx.body = await ctx.curl(options.url, options);
    },


    /**
     * 封装统一的调用检查函数，可以在查询、创建和更新等 Service 中复用
     * @param {返回的结果} result
     */
    checkSuccess(result) {
        console.log('--->', result);
        if (result.errcode !== 0 && result.errmsg !== 'ok') {
            const errorMsg = result.errmsg ? result.errmsg : 'unknown error';
            this.ctx.throw(result.errcode, errorMsg);
        }
        // if (!result.data.success) {
        //     // 远程调用返回格式错误
        //     this.ctx.throw(500, 'remote response error', { data: result.data });
        // }
    },

    /**
     *
     * @param {ctx} contx
     * @param {返回的数据} data
     */
    returnSuccessBody(contx, data) {
        contx.status = 200;
        contx.body = {
            data,
            code: 0,
            errMsg: 'success',
        };
    },

    returnFailBody(contx, body) {
        contx.status = 400;
        contx.body = body;
    },
};
