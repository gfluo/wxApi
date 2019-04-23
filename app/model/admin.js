const mongoose = require('./index');

let adminSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
}, {
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt'
    },
    versionKey: false
})

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;