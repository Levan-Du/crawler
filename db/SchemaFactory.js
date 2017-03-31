const BookInfo = require('./schema/bookinfo');
const BookVolume = require('./schema/bookvolume');
const BookChapter = require('./schema/bookchapter');

var schemaList = {
    BookInfo: BookInfo,
    BookVolume: BookVolume,
    BookChapter: BookChapter
};

var create = (schema, obj) => {
    return new schemaList[schema](obj);
}

var get = (schema) => {
    return schemaList[schema];
}

var factory = { create: create, getSchema: get };

module.exports = factory;
