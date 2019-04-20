const mongoose = require('./index');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    pwd: {
        type: String,
    },
    connecttimes: {
        type: Number,
        default: 0
    },
    lastedLoginTime: {
        type: Date,
        default: null
    },
    textpages: {
        type: Number,
        default: 0,
    },
    imagepages: {
        type: Number,
        default: 0,
    },
    incode: {
        type: String,
        default: '000000'
    },
    buyid: {
        type: String,
        default: '000000'
    }
}, {
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt'
    },
    versionKey: false
});

const User = mongoose.model('user', userSchema);
module.exports = User; 