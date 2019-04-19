const User = require('../model/user')
const Incode = require('../model/incode');
const paramsCheck = require('../lib/paramsCheck');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
///const jwtKoa = require('koa-jwt');
const util = require('util');
const config = require('../../config');

class logicApi {
    static async connect(ctx, next) {
        let connectParams = ctx.request.body;
        try {
            await User.updateOne({username: connectParams.username}, {$inc: {connecttimes: 1}});
            ctx.body = {
                success: true,
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async register(ctx, next) {
        let regParams = ctx.request.body;
        try {
            let err = await paramsCheck.register(regParams);
            if (err) {
                console.warn(err);
                ctx.body = {
                    code: -1,
                    error: '请输入正确格式的用户名和密码'
                };
                return;
            }
            let user = await User.findOne({ username: regParams.username });
            if (user) {
                ctx.body = {
                    code: -1,
                    error: '该用户名已被注册'
                }
                return;
            }

            let incode = await Incode.findOne({ code: regParams.incode, deleted: false });
            if (!incode) {
                ctx.body = {
                    code: -1,
                    error: '无效的邀请码'
                }
                return;
            }

            let md5 = crypto.createHash('md5');
            let password = md5.update(regParams.password).digest('hex');
            user = new User({
                username: regParams.username,
                pwd: password,
                incode: regParams.incode,
            });

            await user.save();
            await Incode.updateOne({ code: regParams.incode }, { $set: { deleted: true } });
            ctx.body = {
                code: 0,
                message: '已成功注册，请记住用户名和密码，并登录'
            }
        } catch (e) {
            ctx.body = {
                code: -1,
                error: e.message
            }
        }
    }

    static async login(ctx, next) {
        let loginParams = ctx.request.body;
        try {
            let user = await User.findOne({username: loginParams.username});
            if (user) {
                let md5 = crypto.createHash('md5');
                if (md5.update(loginParams.password).digest('hex') === user.pwd) {
                    let token = jwt.sign({
                        username: user.username,
                        userId: user.id,
                    }, config.token.secret, {expiresIn: config.token.expire});
                    user.connecttimes += 1;
                    user.lastedLoginTime = new Date();
                    user.save();
                    ctx.body = {
                        code: 0,
                        message: '登录成功',
                        token: token
                    }
                    return;
                }
            }

            ctx.body = {
                code: -1,
                error: '用户名或密码不准确'
            }
        } catch (e) {
            ctx.body = {
                code: -1,
                error: e.message
            }
        }
    }
}

module.exports = logicApi