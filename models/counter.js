const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const countSchema = new Schema({
    count: {
        type: Number,
        required:  true
    }
});

module.exports = mongoose.model('counter',countSchema);