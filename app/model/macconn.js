/**
 * Summary: 机器码连接记录
 * @author: zoroshow@outlook.com
 */

const mongoose = require('./index');

let macConnSchema = new mongoose.Schema({
    macname: {
        type: String,
        unique: true,
    },
    connecttimes: {
        type: Number,
        default: 1
    },
    lastedLoginTime: {
        type: Date,
        default: new Date()
    },
    textpages: {
        type: Number,
        default: 0,
    },
    imagepages: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt'
    },
    versionKey: false
});

const MacConn = mongoose.model('macconn', macConnSchema);
module.exports = MacConn;