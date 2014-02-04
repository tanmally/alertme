/**
 * Request Mappings
 */

var login = require('../controllers/login'), hosts = require('../controllers/hosts'), home=require('../controllers/home');

module.exports = function(app, dbOptions, passport, auth) {
	hosts.init(dbOptions);

	app.get('/login', login.login);
	app.get('/', function(req, res){
		res.redirect('/alertme');
	});
	app.get('/alertme', login.index);

	app.post('/authenticate', auth, passport.authenticate('local', {
		failureRedirect : '/'
	}), function(req, res){
		//res.send(req.user);
		res.send("success");
	});
	
	app.get('/home', auth, home.getHomePage);
	app.get('/hosts/allHosts', auth, hosts.getAllhosts);
	app.post('/hosts/save', auth, hosts.save);
	app.post('/hosts/update', auth, hosts.update);
	app.post('/hosts/delete', auth, hosts.deleteHost);
	app.post('/hosts/changeEnabled', auth, hosts.changeEnabled);
	
	
	app.get('/logout', function(req, res){
		req.logout();
		res.send("success");
	});
	
	app.get('/isAuthenticated', function(req, res){
		res.send(req.isAuthenticated() ? req.user : '0');
	});
};
