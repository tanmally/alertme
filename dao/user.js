/*
 * Dao for user
 */

var collection = null;
var dbOptions;
exports.init = function(dbOpts) {
	collection = dbOpts.db.collection("user");
	dbOptions = dbOpts;
};

exports.save = function(jsonData, callback) {
	jsonData['_id'] = new dbOptions.engine.ObjectID();
	collection.insert([ jsonData ], function(error, result) {
		callback(error, result);
	});
};
exports.getAll = function(callback) {
	collection.find().toArray(function(error, result) {
		callback(error, result);
	});
};
exports.findById = function(id, callback) {
	var json = {};
	if(typeof id == "string" || typeof id == "number"){
		json = { _id : new dbOptions.engine.ObjectID(id) };
	} else if(typeof id == "object"){
		json = { _id : id };
	}
	
	collection.findOne(json, function(error, result) {
		callback(error, result);
	});
};
exports.findByRole = function(role, callback) {
	collection.findOne({
		role : role
	}, function(error, result) {
		callback(error, result);
	});
};
exports.findOne = function(json, callback) {
	collection.findOne(json, function(error, result) {
		callback(error, result);
	});
};
exports.deleteById = function(id, callback) {
	var json = {};
	if(typeof id == "string" || typeof id == "number"){
		json = { _id : new dbOptions.engine.ObjectID(id) };
	} else if(typeof id == "object"){
		json = { _id : id };
	}
	collection.remove(json, function(error, result) {
		callback(error, result);
	});
};

exports.deleteAll = function(callback) {
	collection.remove({}, function(error, result) {
		callback(error, result);
	});
};

exports.update = function(id, jsonData, callback) {
	var json = {};
	if(typeof id == "string" || typeof id == "number"){
		json = { _id : new dbOptions.engine.ObjectID(id) };
	} else if(typeof id == "object"){
		json = { _id : id };
	}
	collection.update(json, jsonData, function(error, result) {
		callback(error, result);
	});
};

exports.updateByJson = function(json, jsonData, callback) {
	collection.update(json, jsonData, function(error, result) {
		callback(error, result);
	});
};
