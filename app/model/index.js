const mongoose = require('mongoose');
const config = require('../../config');

mongoose.connect(config.mongoose.uri, config.mongoose.options);

module.exports = mongoose;