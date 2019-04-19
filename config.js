module.exports = {
    server: {
        port: 3000
    },
    apiVersion: '1.0',
    mongoose: {
        uri: 'mongodb://192.168.0.109:27017/wxSmall',
        options: {
            useNewUrlParser: true
        }
    },
    token: {
        secret: 'safasf',
        expire: 48*60*1000
    }
}