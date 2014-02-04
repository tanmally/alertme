/**
 * Database engine
 */

var engine, db, config = require('./config');

if (config.database=="mongodb") {
    engine = require("mongodb");
    module.exports.getDB = function () {
        if (!db) db = new engine.Db(config.mongo.db,
            new engine.Server(config.mongo.host, config.mongo.port, config.mongo.opts),
                {native_parser: false, safe:true});
        return db;
    };
} else {
    engine = require("tingodb")({});
    module.exports.getDB = function () {
        if (!db) db = new engine.Db(config.tingo.dbPath, {});
        return db;
    };
}

module.exports.engine = engine;