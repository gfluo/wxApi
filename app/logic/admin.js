/**
 * Summary: admin端逻辑处理
 * @author: zoroshow@outlook.com
 */
const Incode = require('../model/incode');
const Word = require('../model/word');
const libUtil = require('../lib/util');

class logicAdmin {
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