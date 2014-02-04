/**
 * Module dependencies.
 */

var config = require('./config/config');

var express = require('express')
	, http = require('http')
	, path = require('path')
	, passport = require('passport')
    , app = express()
    , dbEngine = require('./config/engine')
    , WatchMen = require('./watchmen/watchmen')
    , email = require('./watchmen/email')
    , db = dbEngine.getDB();

db.open(function(err, db){
	if(!err){
		if(config.database == "mongodb"){
			db.authenticate(config.mongo.username, config.mongo.password, function(err, res) {
				if(!err){
					var dbOptions = {db : db , engine : dbEngine.engine};
					startServer(dbOptions);
				} else {
					console.log('MongoDB authentication failed');
				}
			});
		} else {
			var dbOptions = {db : db , engine : dbEngine.engine};
			startServer(dbOptions);
		}
	} else {
		console.log('Error in opening connection with database');
	}
});

function startServer(dbOptions){
	var expressConfig = require('./config/express');
	expressConfig(app, express, path, __dirname, passport, config);

	var passportConf = require('./config/passport');
	passportConf(passport, dbOptions, config);

	var auth = require('./config/auth')(passport, express);

	var reqmap = require('./config/reqmap');
	reqmap(app, dbOptions, passport, auth);

	var httpServer = http.createServer(app);

	httpServer.listen(config.app.port, config.app.hostname, function(req,
			res, next) {
		console.log('Http server on port : ' + config.app.port);
		var watchmen = new WatchMen();
		watchmen.start();
		
		watchmen.on('service_error', function(host, state) {
			  if (state.prev_state.status === 'success' && host.config.enabled && host.config.alert_to) {
				var message =  "<div>" + host.host + ":" + host.port + " is down!." + "</div><br> <div>Reason: " + state.error + "</div>";
				if(host.config.url){
					message = message + "<br><div>URL : "+host.config.url+"</div>";
				}
				var params = {host : host.host, port : host.port, to : host.config.alert_to, message : message}; 
			    email.sendEmail(params);
			  }
		});
		
		watchmen.on('service_back', function(host, state) {
			  if (host.config.enabled && host.config.alert_to){
				var message =  "<div>" + host.host + ":" + host.port + " is back!." + "</div>";
				if(host.config.url){
					message = message + "<br><div>URL : "+host.config.url+"</div>";
				}
				var params = {host : host.host, port : host.port, to : host.config.alert_to, message : message};
			    email.sendEmail(params);
			  }
		});
		
		watchmen.on('service_warning', function(host, state) {
			  if (host.config.enabled && host.config.alert_to){
				var message =  "<div>WARNING : " + host.host + ":" + host.port + " taking more time to respond." + "</div>";
				if(host.config.url){
					message = message + "<br><div>URL : "+host.config.url+"</div>";
				}
				var params = {host : host.host, port : host.port, to : host.config.alert_to, message : message};
			    email.sendEmail(params);
			  }
		});
		
	});
}

process.on('uncaughtException', function (err) {
	  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
	  console.error(err.stack);
	  process.exit(1);
});
