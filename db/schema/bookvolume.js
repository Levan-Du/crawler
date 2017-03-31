const mongoose = require('../db');

const bookvolumeSchema = mongoose.Schema({
    bookid: Number,
    title: String,
    url: String
});

var BookVolume = mongoose.model('BookVolume', bookvolumeSchema);

module.exports = BookVolume;
