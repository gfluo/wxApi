const mongoose = require('./index');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    }
}, {
    versionKey: false
});

const User = mongoose.model('users', userSchema);
module.exports = User; 