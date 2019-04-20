/**
 * Summary: 字体库表
 * @author: zoroshow@outlook.com
 */

const mongoose = require('./index');

let fontStoreScheam = new mongoose.Schema({
    fontname: {
        type: String
    },
    userId: {
        type: String
    },
    username: {
        type: String
    },
    fontlib: {
        type: String,
    },
    done: {
        type: Number,
        default: 0,
    },
    fontfile: {
        type: String,   ///15位英文长度字符串
    },
    modifiedtime: {
        type: Date,
        default: new Date()
    },
    share: {
        type: Boolean,
        default: false,
    },
    data: [],
    preview: [],
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt'
    },
    versionKey: false,
})

const FontStore = mongoose.model('fontStore', fontStoreScheam);
module.exports = FontStore;