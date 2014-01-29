/*
 * Dao for hosts
 */

var jf = require('jsonfile');
var collection = null;
var hostsJson = {};

exports.init = function(db) {
	collection = db.collection("hosts");
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
	collection.insert([ jsonData ], function(error, result) {
		if (!error) {
			updatehostsJson();
		}
		callback(error, result);
	});
};

exports.update = function(query, jsonData, callback) {
	collection.update(query, jsonData, function(error, result) {
		if (!error) {
			updatehostsJson();
		}
		callback(error, result);
	});
};

exports.updateState = function(query, jsonData, callback) {
	collection.update(query, jsonData, function(error, result) {
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
	collection.findOne({
		_id : id
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
	collection.remove({
		_id : id
	}, function(error, result) {
		if (!error) {
			updatehostsJson();
		}
		callback(error, result);
	});
};