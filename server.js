const { server } = require('./config');
const Koa = require('Koa');
const koaBody = require('koa-body');
const Api = require('./app/router/api');
const Admin = require('./app/router/admin');
const Auth = require('./app/auth');
const app = new Koa();
const static = require('koa-static');
const path = require('path');

app.use(koaBody());

app
    .use(static(path.join(__dirname, './public')))
    .use(Auth)
    .use(Api.routes())
    .use(Api.allowedMethods())
    .use(Admin.routes())
    .use(Admin.allowedMethods())
app.listen(server.port)
console.log(`server is listening on localhost port:${server.port}`);
