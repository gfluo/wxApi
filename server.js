const { server } = require('./config');
const Koa = require('Koa');
const koaBody = require('koa-body');
const Api = require('./app/router/api');
const app = new Koa();

app.use(koaBody());

app
    .use(Api.routes())
    .use(Api.allowedMethods())

app.listen(server.port)
console.log(`server is listening on localhost port:${server.port}`);
