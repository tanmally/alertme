app.service('login', function(httpService) {
	this.authenticate = function(data, callback) {
		httpService.postRequest('authenticate', data, 'application/x-www-form-urlencoded', callback);
	};
	
	this.isAuthenticated = function(callback){
		httpService.getRequest('isAuthenticated', callback);
	};
});

app.service('logout', function(httpService) {
	this.logout = function(callback) {
		httpService.getRequest('logout', callback);
	};
});

app.service('host', function(httpService) {
	this.getAllHosts = function(callback) {
		httpService.getRequest('hosts/allHosts', callback);
	};
	this.update = function(data, callback){
		httpService.postRequest('hosts/update', data, 'application/json', callback);
	};
	this.deleteHost = function(data, callback) {
		httpService.postRequest('hosts/delete', data, 'application/json', callback);
	};
	this.save = function(data, callback){
		httpService.postRequest('hosts/save', data, 'application/json', callback);
	};
	this.changeEnabled = function(data, callback){
		httpService.postRequest('hosts/changeEnabled', data, 'application/json', callback);
	};
});