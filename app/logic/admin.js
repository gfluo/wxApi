/**
 * Summary: admin端逻辑处理
 * @author: zoroshow@outlook.com
 */
const Incode = require('../model/incode');
const libUtil = require('../lib/util');

class logicAdmin {
    static async generateIncode (ctx, next) {   ///生成邀请码
        let code = libUtil.generateStrs(10);
        let incode = new Incode({
            code: code
        });

        incode.save();
        ctx.body = {
            code: 0,
            msg: '邀请码生成成功',
            incode: code
        }
    }
}

module.exports = logicAdmin;