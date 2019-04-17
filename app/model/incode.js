/**
 * Summary: 邀请码模型文件
 * @author: zoroshow@outlook.com
 */

const mongoose = require('./index');

let incodeSchema = new mongoose.Schema({
    incode: {
        type: String
    }
}, {
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt'
    },
    versionKey: false,
});

const Incode = mongoose.model('incodes', incodeSchema);
module.exports = Incode;