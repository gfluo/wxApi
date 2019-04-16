const Router = require('koa-router');
const { apiVersion } = require('../../config');
const User = require('../model/user');
let router = new Router({
    prefix: `/${apiVersion}/api`
})

router.post('/userreg', (ctx, next) => {
    let user = new User({
        username: luogf
    });
    user.save();
    ctx.body = {
        result: '注册成功'
    }
})

module.exports = router;