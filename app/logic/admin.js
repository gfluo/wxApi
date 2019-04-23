/**
 * Summary: admin端逻辑处理
 * @author: zoroshow@outlook.com
 */
const Incode = require('../model/incode');
const Word = require('../model/word');
const Admin = require('../model/admin');
const libUtil = require('../lib/util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');

class logicAdmin {
    static async getWord(ctx, next) {
        let params = ctx.request.body;
        try {
            let word =
                await Word.findOne({ fontfile: params.fontfile, word: params.word }, '-_id word code');
            if (word) {
                ctx.body = {
                    success: true,
                    message: '获取成功',
                    data: word
                }
            } else {
                ctx.body = {
                    success: false,
                    error: '该文字没有录入'
                }
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async generateIncode(ctx, next) {   ///生成邀请码
        let params = ctx.request.body;
        let codes = [];
        let insertCodes = [];
        try {
            for (let i = 0; i < (params.number ? params.number : 1); i++) {
                let code = libUtil.generateStrs(15);
                codes.push(code);
                insertCodes.push({
                    code: code
                })
            }
            await Incode.insertMany(insertCodes);

            ctx.body = {
                success: true,
                message: '邀请码生成成功',
                incodes: codes
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async register(ctx, next) {
        let params = ctx.request.body;
        try {
            let md5 = crypto.createHash('md5');
            let admin = new Admin({
                username: params.username,
                password: md5.update(params.password).digest('hex'),
            })
            await admin.save()
            ctx.body = {
                success: true,
                message: 'admin账户创建成功'
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async login(ctx, next) {
        let params = ctx.request.body;
        try {
            let md5 = crypto.createHash('md5');
            let admin = await Admin.findOne({
                username: params.username,
                password: md5.update(params.password).digest('hex'),
            })

            if (!admin) {
                ctx.body = {
                    success: false,
                    error: '账号或者密码错误'
                }
                return;
            }

            let token = jwt.sign({
                username: params.username,
                admin: true,
            }, config.token.secret, { expiresIn: config.token.expire });

            ctx.body = {
                code: 0,
                message: '登录成功',
                token: token
            };
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }
}

module.exports = logicAdmin;