const Router = require('koa-router');
//const crypto = require('crypto');
const { apiVersion } = require('../../config');
const logicAdmin = require('../logic/admin');
let router = new Router({
    prefix: `/${apiVersion}/admin`
})

router.get('/generateIncode', logicAdmin.generateIncode);

module.exports = router;