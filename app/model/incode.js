/**
 * Summary: 邀请码模型文件
 * @author: zoroshow@outlook.com
 */

const mongoose = require('./index');

let incodeSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
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
});

const Incode = mongoose.model('incode', incodeSchema);
module.exports = Incode;