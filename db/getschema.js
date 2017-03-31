const SchemaFactory = require('./SchemaFactory');

var getschema = (schema) => {
    return SchemaFactory.getSchema(schema);
}

module.exports = getschema;
