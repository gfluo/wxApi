/**
 * Summary: 权限认证
 * @author: zoroshow@outlook.com
 */
const { apiVersion, token } = require('../config');
const jwt = require('jsonwebtoken');
///const jwtKoa = require('koa-jwt');
const util = require('util');
const verify = util.promisify(jwt.verify);

module.exports = async (ctx, next) => {
    let url = ctx.request.url;

    if ( -1 < url.indexOf(`/${apiVersion}/api/userreg`) 
        || -1 < url.indexOf(`/${apiVersion}/api/userlogin`)
        || -1 < url.indexOf(`/${apiVersion}/admin/register`)
        || -1 < url.indexOf(`/${apiVersion}/admin/login`)
        || -1 < url.indexOf(`/${apiVersion}/api/macconnect`)
        || -1 < url.indexOf(`/${apiVersion}/api/mactext`)
        || -1 < url.indexOf(`/${apiVersion}/api/macimage`)
        || -1 < url.indexOf(`/${apiVersion}/api/userconnect`)
        || -1 < url.indexOf(`/${apiVersion}/api/text`)
        || -1 < url.indexOf(`/${apiVersion}/api/image`)) {
        await next();
    } else {
        try {
            let userToken = ctx.request.headers["authorization"].split(' ')[1];
            let userInfo = await verify(userToken, token.secret);
            if (-1 < url.indexOf('admin') && !userInfo.admin) {
                ctx.body = {
                    errorCode: 403,
                    success: false,
                    error: 'token认证失败'
                };
                return;
            }
            ctx.request.body.username = userInfo.username;
            ctx.request.body.userId = userInfo.userId;
            await next();
        } catch (e) {
            ctx.body = {
                errorCode: 403,
                success: false,
                error: 'token认证失败'
            }
        }
    }
}