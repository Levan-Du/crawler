const mongoose = require('../db');

const bookchapterSchema = mongoose.Schema({
    bookid: Number,
    chapter: String
});

var BookChapter = mongoose.model('BookChapter', bookchapterSchema);

module.exports = BookChapter;
