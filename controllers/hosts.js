/*
 * Hosts controller
 */

var hostsDao = require("../dao/hosts");

exports.init = function(db) {
	hostsDao.init(db);
};

exports.save = function(req, res) {
	var host = req.body.host;
	if(host && host.host && host.port){
		var hostJson = {host : host.host, port : host.port, config : host.config, state : {}};
		hostsDao.save(hostJson, function(error, data){
			if(error){
				res.send({error : error});
			} else {
				res.send({data : data[0]});
			}
		});
	}
};

exports.update = function(req, res) {
	var host = req.body.host;
	if(host._id){
		hostsDao.findById(host._id, function(error, result){
			if(result){
				result.host = host.host;
				result.port = host.port;
				result.config = host.config;
				result.state = host.state;
				hostsDao.update(host._id, result, function(error, data){
					if(error){
						res.send("");
					} else {
						res.send({id : data});
					}
				});
			}
		});
	}
};

exports.deleteHost = function(req, res){
	var id = req.body.id;
	if(id){
		hostsDao.findById(id, function(error, host){
			if(host){
				hostsDao.deleteById(id, function(error, data){
					if(error){
						res.send("");
					} else {
						res.send({id : data});
					}
				});
			}
		});
	}
};

exports.changeEnabled = function(req, res){
	var changeEnabled = req.body.changeEnabled;
	var id = req.body.id;
	if(id){
		hostsDao.findById(id, function(error, host){
			if(host){
				if(changeEnabled == true){
					host.config.enabled = true;
				} else if (changeEnabled == false){
					host.config.enabled = false;
				}
				hostsDao.update(id, host, function(error, data){
					if(error){
						res.send("");
					} else {
						res.send({id : data});
					}
				});
			}
		});
	}
};

exports.getAllhosts = function(req, res) {
	hostsDao.getAll(function(error, data) {
		if(error){
			res.send("");
		} else {
			res.send(data);
		}
	});
};
