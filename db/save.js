const SchemaFactory = require('./SchemaFactory');

var save = (collection, obj) => {
    return new Promise((resolve, reject) => {
        var schema = SchemaFactory.create(collection, obj);
        schema.save((err, s) => {
            if (err) {
                reject(err);
                return;
            }
            resolve('success')
        });
    });
}

var saveMany = (collection, arr) => {
    var promises = arr.map((el) => {
        return new Promise((resolve, reject) => {
            var schema = SchemaFactory.create(collection, el);
            schema.save((err, s) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('success')
            });
        });
    });
    return Promise.all(promises)
}

var saveBook = {
    save: save,
    saveMany: saveMany
}

module.exports = saveBook;
