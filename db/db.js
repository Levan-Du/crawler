const mongoose = require('mongoose');
const dburl = "mongodb://localhost:27017/book";

mongoose.connect(dburl);

var db = mongoose.connection;
db.on('error', (err) => {
    console.log(err);
});
db.on('open', (cb) => {
    console.log('db opened');
});

module.exports = mongoose;
