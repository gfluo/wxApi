const User = require('../model/user')
const Incode = require('../model/incode');
const paramsCheck = require('../lib/paramsCheck');
const crypto = require('crypto');

class logicApi {
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
}

module.exports = logicApi