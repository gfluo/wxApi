/**
 * Summary: 权限认证
 * @author: zoroshow@outlook.com
 */
const { appVersion, token } = require('../config');
const jwt = require('jsonwebtoken');
///const jwtKoa = require('koa-jwt');
const util = require('util');
const verify = util.promisify(jwt.verify);

module.exports = async (ctx, next) => {
    let url = ctx.request.url;

    if (`/${appVersion}/api/userreg` === url || `/${appVersion}/api/userlogin` === url) {
        await next();
    } else {
        try {
            let userToken = ctx.request.headers["authorization"].split(' ')[1];
            let userInfo = await verify(userToken, token.secret);
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