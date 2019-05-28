const User = require('../model/user');
const MacConn = require('../model/macconn');
const Incode = require('../model/incode');
const FontStore = require('../model/fontStore');
const paramsCheck = require('../lib/paramsCheck');
const selfUtil = require('../lib/util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');

class logicApi {
    static async getFontAES(ctx, next) {
        let params = ctx.request.body;
        try {
            let detail = await FontStore.findOne({
                username: params.username,
                deleted: false,
                fontfile: params.fontfile
            }, '-createdAt -updatedAt -_id -userId');

            if (detail) {
                ctx.body = {
                    success: true,
                    message: '获取成功',
                    data: selfUtil.AESsecret(JSON.stringify(detail), config.aesKey, ''),
                }
            } else {
                ctx.body = {
                    success: false,
                    error: '获取字体库信息失败'
                }
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }

    static async macimage(ctx, next) {
        let params = ctx.request.body;
        params.page = parseInt(params.page);
        try {
            let macconn = await MacConn.findOne({ macname: params.macname });
            if (macconn) {
                ///macconn.connecttimes += 1;
                ///macconn.lastedLoginTime = new Date();
                macconn.imagepages += params.page;
                await macconn.save();
            } else {
                macconn = new MacConn({
                    macname: params.macname,
                    imagepages: params.page
                })
                await macconn.save();
            }

            ctx.body = {
                success: true
            }
        } catch (e) {
            ctx.body = {
                success: false
            }
        }
    }

    static async mactext(ctx, next) {
        let params = ctx.request.body;
        params.page = parseInt(params.page);
        try {
            let macconn = await MacConn.findOne({ macname: params.macname });
            if (macconn) {
                ///macconn.connecttimes += 1;
                ///macconn.lastedLoginTime = new Date();
                macconn.textpages += params.page;
                await macconn.save();
            } else {
                macconn = new MacConn({
                    macname: params.macname,
                    textpages: params.page
                })
                await macconn.save();
            }

            ctx.body = {
                success: true
            }
        } catch (e) {
            ctx.body = {
                success: false
            }
        }
    }

    static async macConnect(ctx, next) {
        let params = ctx.request.body;
        try {
            let macconn = await MacConn.findOne({ macname: params.macname });
            if (macconn) {
                macconn.connecttimes += 1;
                macconn.lastedLoginTime = new Date();
                await macconn.save();
            } else {
                macconn = new MacConn({
                    macname: params.macname
                })
                await macconn.save();
            }

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

    static async getWord(ctx, next) {
        let params = ctx.request.body;
        try {
            let fontStore = await FontStore.findOne({
                userId: params.userId,
                fontfile: params.fontfile,
                deleted: false,
                'data.word': params.word,
            });

            if (!fontStore) {
                ctx.body = {
                    success: false,
                    error: '该文字没有录入'
                };
                return;
            }

            let wordcode = null;
            for (let i = 0; i < fontStore.data.length; i++) {
                if (fontStore.data[i].word === params.word) {
                    wordcode = fontStore.data[i];
                    break;
                }
            }

            ctx.body = {
                success: true,
                message: '获取成功',
                data: wordcode
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
            let delRes = await FontStore.updateOne({    ///先删除
                userId: params.userId,
                fontfile: params.fontfile,
                deleted: false,
                'data.word': params.wordcode.word
            }, {
                    $pull: {
                        data: {
                            word: params.wordcode.word
                        }
                    }
                });

            let res = await FontStore.updateOne({
                userId: params.userId,
                fontfile: params.fontfile,
                deleted: false,
            }, {
                    $push: {
                        data: {
                            word: params.wordcode.word,
                            svg: params.wordcode.svg
                        }
                    },
                    $inc: {
                        done: delRes.n ? 0 : 1,
                    }
                })

            if (res.n === 1) {
                ctx.body = {
                    success: true,
                    message: '增加字体成功'
                };
                return;
            }

            ctx.body = {
                success: false,
                message: '增加字体失败'
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
            let res = await FontStore.updateOne({
                fontfile: { 
                    $in: params.fontfiles 
                },
                username: params.username,
                deleted: false,
            }, {
                    $set: {
                        deleted: true
                    }
                });
            if (res.n === 1) {
                ctx.body = {
                    success: true,
                    message: '删除字体库成功'
                }
            } else {
                ctx.body = {
                    message: false,
                    message: '删除字体库失败'
                }
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
                ctx.body = {
                    success: true,
                    message: '获取成功',
                    data: detail
                }
            } else {
                ctx.body = {
                    success: false,
                    error: '获取字体库信息失败'
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
            }, '-_id fontname fontid done fontfile');
            ctx.body = {
                success: true,
                message: '获取成功',
                total: fonts.length,
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
                fontid: params.fontid,
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
                    success: false,
                    error: '请输入正确格式的用户名和密码'
                };
                return;
            }
            let user = await User.findOne({ username: regParams.username });
            if (user) {
                ctx.body = {
                    success: false,
                    error: '该用户名已被注册'
                }
                return;
            }

            let incode = await Incode.findOne({ code: regParams.incode, deleted: false });
            if (!incode) {
                ctx.body = {
                    success: false,
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
                success: true,
                message: '已成功注册，请记住用户名和密码，并登录'
            }
        } catch (e) {
            ctx.body = {
                success: false,
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
                        success: true,
                        message: '登录成功',
                        token: token
                    }
                    return;
                }
            }

            ctx.body = {
                success: false,
                error: '用户名或密码不准确'
            }
        } catch (e) {
            ctx.body = {
                success: false,
                error: e.message
            }
        }
    }
}

module.exports = logicApi