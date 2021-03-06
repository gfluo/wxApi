const Router = require('koa-router');
//const crypto = require('crypto');
const { apiVersion } = require('../../config');
const logicAdmin = require('../logic/admin');
let router = new Router({
    prefix: `/${apiVersion}/admin`
})

router.post('/generateIncode', logicAdmin.generateIncode);
router.post('/overword', logicAdmin.getWord);
router.post('/register', logicAdmin.register);
router.post('/login', logicAdmin.login);
router.post('/getallincode', logicAdmin.aliveIncode);
router.post('/deleteusedincode', logicAdmin.trueDelIncode);
router.post('/deletewordlib', logicAdmin.trueDelFont);

module.exports = router;