const { server } = require('./config');
const Koa = require('Koa');
const Api = require('./app/router/api');
const app = new Koa();

app
    .use(Api.routes())
    .use(Api.allowedMethods())

app.listen(server.port)
console.log(`server is listening on localhost port:${server.port}`);
