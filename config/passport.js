/**
 * Passport configuration for authentication
 */

var LocalStrategy = require('passport-local').Strategy;
var userDao = require("../dao/user");

module.exports = function(passport, dbOpts, config) {
	userDao.init(dbOpts);

	userDao.findByRole('ADMIN_USER', function(error, result) {
		if (result == null) {
			var userJson = {
				username : config.credentials.username,
				password : config.credentials.password,
				role : "ADMIN_USER"
			};
			userDao.save(userJson, function(error, result) {
				if(error){
					console.log('failed to save user details');
				} else {
					console.log('user details saved');
				}
			});
		} else {
			result.username = config.credentials.username;
			result.password = config.credentials.password;
			userDao.updateByJson({role : 'ADMIN_USER'}, result, function(error, result) {
				if(error){
					console.log('failed to update user details');
				} else {
					console.log('user details updated');
				}
			});
		}
	});

	passport.use(new LocalStrategy(function(username, password, done) {
		userDao.findOne({
			username : username,
			password : password
		}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message : 'Incorrect username.'
				});
			}
			return done(null, user);
		});
	}));

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		userDao.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
