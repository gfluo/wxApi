const Router = require('koa-router');
const crypto = require('crypto');
const { apiVersion } = require('../../config');
const User = require('../model/user');
let router = new Router({
    prefix: `/${apiVersion}/api`
})

router.post('/userreg', (ctx, next) => {
    let register = ctx.request.body;
    if (register.password.length < 6) {
        ctx.body = {
            code: -1,
            msg: '密码长度不能小于6位'
        }
        return;
    }
    let user = new User({
        username: register.username,
        password: crypto.createHash('md5').update(register.password).digest('hex'), 
    });
    user.save();
    ctx.body = {
        result: '注册成功'
    }
})

module.exports = router;