function loginController($scope, $location, login) {
	$scope.username = "";
	$scope.password = "";
	$scope.login = function() {
		$scope.username = $("#username").val();
		$scope.password = $("#password").val();
		
		var data = "username=" + $scope.username + "&password="
				+ $scope.password;
		login.authenticate(data, function(data) {
			if (data == "success") {
				$location.path("/home");
			}
		});
		return false;
	};
}

function homeController($scope, $location, host, $timeout) {
	$scope.hosts = [];
	$scope.action = null;
	var getAllHosts= function(){
		host.getAllHosts(function(data) {
			$scope.hosts = data;
			refresh();
		});
	};
	
	getAllHosts();
	
	var refresh = function(){
	    $timeout(function(){
	    	getAllHosts();
	    },10000);
	};

	$scope.openModal = function(host, action){
		$scope.action = action;
		if(action == "add"){
			var config = {enabled : false, ping_service : "", timeout : "", ping_interval : "",
					alert_to : "", warning_if_takes_more_than : "", method : "",
						url : "", expectedStatuscode : "", expectedData : ""};
			
			$scope.selectedHost  = {host : "", port : "", config : config, state : {}};
		} else if(action == "edit"){
			$scope.selectedHost = host;
		}
	};
	
	$scope.saveOrUpdate = function(){
		if($scope.action == "add"){
			$scope.saveHost();
		} else if($scope.action == "edit"){
			$scope.updateHost();
		}
	};

	$scope.updateHost = function(){
		var data = {host : $scope.selectedHost, id : $scope.selectedHost._id};
		host.update(data, function(data){
			getAllHosts();
		});
	};
	
	$scope.saveHost = function(){
		var data = {host : $scope.selectedHost};
		host.save(data, function(data){
			getAllHosts();
		});
	};
	
	$scope.deleteHostId = null;
	$scope.deleteHost = function(){
		var data = {id : $scope.deleteHostId};
		host.deleteHost(data, function(data) {
			$scope.deleteHostId = null;
			$scope.getAllHosts();
		});
	};
	
	$scope.deleteHostModal = function(id){
		$scope.deleteHostId = id;
	};
	
	
	$scope.changeEnabled = function(hostId, enabled){
		var data = {id: hostId, changeEnabled : ''};
		if(enabled == 'true'){
			data = {id: hostId, changeEnabled : true};
		} else if('false'){
			data = {id: hostId, changeEnabled : false};
		}
		host.changeEnabled(data, function(data){
			getAllHosts();
		});
	};
}

function logoutController($scope, $rootScope, logout, $location) {
	$scope.logout = function() {
		logout.logout(function(data) {
			if (data == "success") {
				$rootScope.isLoggedIn = false;
				$rootScope.loggedInUser = null;
				$location.path("/login");
			}
		});
	};
}

function errorController($scope, $http, $location, $rootScope) {
	$scope.status = $rootScope.status;
	$rootScope.status = "";
	$scope.data = $rootScope.data;
	$rootScope.data = "";
	$scope.message = "";

	switch ($scope.status) {
	case 404:
		$scope.message = "Not found 404 ";
		break;
	case 500:
		$scope.message = "Internal Error 500";
		break;
	case 400:
		$scope.message = "Bad request 400";
		break;
	case 401:
		$scope.message = "401 Unauthorized";
		break;
	default:
		$scope.message = "Error";
	}
}
