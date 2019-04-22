const User = require('../model/user')
const Incode = require('../model/incode');
const FontStore = require('../model/fontStore');
const Word = require('../model/word');
const paramsCheck = require('../lib/paramsCheck');
const selfUtil = require('../lib/util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');

class logicApi {
    static async getWord(ctx, next) {
        let params = ctx.request.body;
        try {
            let word = 
                await Word.findOne({fontfile: params.fontfile, word: params.word}, '-_id word code');
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

    static async addWord(ctx, next) {
        let params = ctx.request.body;
        if (typeof ctx.request.body === "string") {
            params = JSON.parse(params);
        }
        try {
            let word = 
                await Word.findOne({userId: params.userId, fontfile: params.fontfile, word: params.wordcode.word});
            if (word) {
                word.code = params.wordcode.code;
                await word.save();
            } else {
                word = new Word({
                    userId: params.userId,
                    fontfile: params.fontfile,
                    word: params.wordcode.word,
                    code: params.wordcode.code
                })
                await word.save();
            }
            ctx.body = {
                success: true,
                message: '增加字体成功'
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async delFont(ctx, next) {
        let params = ctx.request.body;
        try {
            await FontStore.updateOne({
                username: params.username,
                fontfile: params.fontfile
            }, {
                $set: {
                    deleted: true
                }
                });
            ctx.body = {
                success: true,
                message: '删除成功'
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async fontDetail(ctx, next) {
        let params = ctx.request.body;
        try {
            let detail = await FontStore.findOne({
                username: params.username,
                deleted: false,
                fontfile: params.fontfile
            }, '-createdAt -updatedAt -_id -userId');

            if (detail) {
                let words = 
                    await Word.find({userId: params.userId, fontfile: params.fontfile}, '-_id word code');
                detail.data = words;
                ctx.body = {
                    success: true,
                    message: '获取成功',
                    data: detail
                }
            } else {
                ctx.body = {
                    success: false,
                    error: '获取字体失败，当前字体不存在'
                }
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async fontInfo(ctx, next) {
        let params = ctx.request.body;
        try {
            let fonts = await FontStore.find({
                userId: params.userId, deleted: false
            }, 'fontname fontlib done fontfile');
            ctx.body = {
                success: true,
                message: '获取成功',
                data: fonts
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async creareFont(ctx, next) {
        let params = ctx.request.body;
        try {
            ///let { share } = params;
            let strs = selfUtil.generateStrs(15, 1);    ///生成15位英文字符串
            let fontStore = new FontStore({
                username: params.username,
                userId: params.userId,
                fontname: params.fontname,
                fontlib: params.fontlib,
                fontfile: strs,
                share: params.share,
                data: [],
                preview: [],
            })
            await fontStore.save();
            ctx.body = {
                success: true,
                message: '创建成功',
                data: {
                    fontfile: strs
                }
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async imagePageAdd(ctx, next) { ///图片输入api
        let params = ctx.request.body;
        try {
            await User.updateOne({
                username: params.username,
                $inc: {
                    imagepages: params.page
                }
            });
            ctx.body = {
                success: true
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }
    static async textPageAdd(ctx, next) {   ///文字数量api
        let params = ctx.request.body;
        try {
            await User.updateOne({
                username: params.username
            }, {
                    $inc: {
                        textpages: parseInt(params.page)
                    }
                });

            ctx.body = {
                success: true
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async connect(ctx, next) {
        let connectParams = ctx.request.body;
        try {
            await User.updateOne({
                username: connectParams.username
            }, {
                    $inc: {
                        connecttimes: 1
                    },
                    $set: {
                        lastedLoginTime: new Date(),
                    }
                });
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
            let user = await User.findOne({ username: loginParams.username });
            if (user) {
                let md5 = crypto.createHash('md5');
                if (md5.update(loginParams.password).digest('hex') === user.pwd) {
                    let token = jwt.sign({
                        username: user.username,
                        userId: user.id,
                    }, config.token.secret, { expiresIn: config.token.expire });
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