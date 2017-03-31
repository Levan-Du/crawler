const mongoose = require('../db');

const bookinfoSchema = mongoose.Schema({
    bookid: Number,
    intro: String,
    tag: String
});

var BookInfo = mongoose.model('BookInfo', bookinfoSchema);

module.exports = BookInfo;
