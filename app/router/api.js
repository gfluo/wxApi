const Router = require('koa-router');
const crypto = require('crypto');
const { apiVersion } = require('../../config');
const logicApi = require('../logic/api');
let router = new Router({
    prefix: `/${apiVersion}/api`
})

router.post('/userreg', logicApi.register);
router.post('/userlogin', logicApi.login);
router.post('/userconnect', logicApi.connect);
router.post('/text', logicApi.textPageAdd);
router.post('/image', logicApi.imagePageAdd);
router.post('/createFont', logicApi.creareFont);

module.exports = router;