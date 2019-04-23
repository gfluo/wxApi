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

    if (`/${apiVersion}/api/userreg` === url 
        || `/${apiVersion}/api/userlogin` === url
        || `/${apiVersion}/admin/register` === url
        || `/${apiVersion}/admin/login` === url
        || `/${apiVersion}/api/macconnect` === url
        || `/${apiVersion}/api/mactext` === url
        || `/${apiVersion}/api/macimage` === url
        || `/${apiVersion}/api/userconnect` === url
        || `/${apiVersion}/api/text` === url
        || `/${apiVersion}/api/image` === url) {
        await next();
    } else {
        try {
            let userToken = ctx.request.headers["authorization"].split(' ')[1];
            let userInfo = await verify(userToken, token.secret);
            if (-1 < url.indexOf('admin') && !userInfo.admin) {
                ctx.body = {
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
                success: false,
                error: 'token认证失败'
            }
        }
    }
}