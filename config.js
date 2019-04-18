module.exports = {
    server: {
        port: 3000
    },
    apiVersion: '1.0',
    mongoose: {
        uri: 'mongodb://172.20.192.236:27017/wxSmall',
        options: {
            useNewUrlParser: true
        }
    }
}