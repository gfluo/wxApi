/**
 * Summary: 具体的字体信息
 * @author: zoroshow@outlook.com
 */

const mongoose = require('./index');
let wordSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    fontfile: {
        type: String
    },
    word: {
        type: String
    },
    code: {
        type: String
    }
}, {
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt'
    },
    versionKey: false,
})

const Word = mongoose.model('word', wordSchema);
module.exports = Word;