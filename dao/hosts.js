/*
 * Dao for hosts
 */

var jf = require('jsonfile');
var collection = null;
var hostsJson = {};
var dbOptions;

exports.init = function(dbOpts) {
	collection = dbOpts.db.collection("hosts");
	dbOptions = dbOpts;
};

var updatehostsJson = function() {
	hostsJson = {};
	collection.find().toArray(function(error, result) {
		var hosts = [];
		if (result && result != null) {
			for(var i=0; i<result.length; i++){
				hosts.push({host : result[i].host, port : result[i].port, id : result[i]._id, enabled : result[i].config.enabled});
			}
			hostsJson = {hosts : hosts};
			jf.writeFile("./config/hosts.json", hostsJson, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file is saved!");
			    }
			}); 
		}
	});
};

exports.updateJson = function(){
	hostsJson = {};
	collection.find().toArray(function(error, result) {
		var hosts = [];
		if (result && result != null) {
			for(var i=0; i<result.length; i++){
				hosts.push({host : result[i].host, port : result[i].port, id : result[i]._id, enabled : result[i].config.enabled});
			}
			hostsJson = {hosts : hosts};
			jf.writeFile("./config/hosts.json", hostsJson, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file is saved!");
			    }
			}); 
		}
	});
};

exports.gethostsJson = function(){
	return hostsJson;
};

exports.save = function(jsonData, callback) {
	jsonData['_id'] = new dbOptions.engine.ObjectID();
	collection.insert([ jsonData ], function(error, result) {
		if (!error) {
			updatehostsJson();
		}
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
		if (!error) {
			updatehostsJson();
		}
		callback(error, result);
	});
};

exports.updateState = function(id, jsonData, callback) {
	var json = {};
	if(typeof id == "string" || typeof id == "number"){
		json = { _id : new dbOptions.engine.ObjectID(id) };
	} else if(typeof id == "object"){
		json = { _id : id };
	}
	
	collection.update(json, jsonData, function(error, result) {
		if (!error) {
		}
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

exports.findOne = function(json, callback) {
	collection.findOne(json, function(error, result) {
		callback(error, result);
	});
};

exports.deleteById = function(id, callback) {
	collection.remove({
		_id : new dbOptions.engine.ObjectID(id)
	}, function(error, result) {
		if (!error) {
			updatehostsJson();
		}
		callback(error, result);
	});
};