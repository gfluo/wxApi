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
router.post('/createfont', logicApi.creareFont);
router.post('/getfontinfo', logicApi.fontInfo);
router.post('/getfontdetail', logicApi.fontDetail);
router.post('/delfont', logicApi.delFont);
router.post('/addword', logicApi.addWord);
router.post('/getword', logicApi.getWord);
router.post('/macconnect', logicApi.macConnect);
router.post('/mactext', logicApi.mactext);
router.post('/macimage', logicApi.macimage);
router.post('/engetfontdetail', logicApi.getFontAES);

module.exports = router;