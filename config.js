module.exports = {
    server: {
        port: 3000
    },
    apiVersion: '1.0',
    mongoose: {
        ///uri: 'mongodb://172.20.192.236:27017/wxSmall',
        uri: 'mongodb://192.168.0.100:27017/wxSmall',
        options: {
            useCreateIndex: true,
            useNewUrlParser: true
        }
    },
    aesKey: 'sagshdghytjyjyry',
    token: {
        secret: 'safasf',
        expire: 48 * 60 * 1000
    }
}