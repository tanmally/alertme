var events = require('events'), fs = require('fs'), http = require('./ping/http'), hostsDao = require('../dao/hosts');

function WatchMen(){
  this.daemon_status = 0; //0=stopped, 1=running
}

require('util').inherits(WatchMen, events.EventEmitter);

/*---------------
 Ping service
-----------------*/
WatchMen.prototype.ping = function (params, callback){
  var self = this;
  var timestamp = params.timestamp || +new Date(); //allow timestamp injection for easy testing

  hostsDao.findById(params.host.id, function (err, host){
      if (err) {return callback (err);}
      
      if(host.config.ping_service){
	      if(host.config.ping_service == 'http' || host.config.ping_service == 'https'){
		      http.ping (host, function(error, body, response, elapsed_time){
		      var hostConfig = host.config;
		      var prev_state = host.state || {};
		      delete prev_state.prev_state; //make sure we don't store nested state
		
		      var state = {
		        elapsed_time : elapsed_time,
		        timestamp : timestamp,
		
		        outages : prev_state.outages || 0,
		        prev_state : prev_state,
		        down_time_acc : prev_state.down_time_acc || 0 ,
		        down_timestamp : prev_state.down_timestamp,
		        up_since: prev_state.up_since || timestamp,
		        running_since: prev_state.running_since || timestamp
		      };
		
		      //-------------------------------------
		      // Decide if service is down (or the response is invalid)
		      //-------------------------------------
		      state.error = error;
		
		      state.status = state.error ? "error" : "success";
		
		      //next interval depends on if the request was successfull or not
		      state.next_attempt_secs = hostConfig.ping_interval;
		
		      //-------------------------------------
		      // Calculate uptime
		      //-------------------------------------
		      var running = (timestamp - state.running_since) / 1000; //seconds
		      var downtime = state.down_time_acc || 0;
		      if (state.down_timestamp){
		        downtime += (timestamp - state.down_timestamp)/1000;
		      }
		      state.uptime = (Math.round((100000 * (running - downtime)) / running) / 1000) || 0;
		
		      //-------------------------------------
		      // Service is down
		      //-------------------------------------
		      if (state.error){
		        //-------------------------------------
		        // Record event and outage only if this is the first error for this service.
		        //-------------------------------------
		        if (prev_state.status !== "error") {
		          state.up_since = null;
		          state.down_timestamp = timestamp;
		          state.outages = (parseInt(prev_state.outages,10) || 0) + 1; //inc outages
		
		          self.emit('service_error', host, state);
		        }
		      }
		      //-------------------------------------
		      // Service is up
		      //-------------------------------------
		      else {
		        state.up_since = state.up_since || timestamp;
		
		        //-------------------------------------
		        // Response over the limit?
		        //-------------------------------------
		        var limit = hostConfig.warning_if_takes_more_than;
		        if (limit && (elapsed_time > limit)){ //over the limit. warning!
		          self.emit('service_warning', host, state);
		        }
		
		        //-------------------------------------
		        // If previous state was "error", emit "service is back"
		        //-------------------------------------
		        if (prev_state.status === "error"){ //service was down and now it is up again!
		          state.down_time_last_request = Math.round((timestamp - prev_state.down_timestamp) / 1000); // in sec
		          state.down_time_acc = (parseInt(state.down_time_acc,10) || 0) + state.down_time_last_request; //accumulated downtime
		          state.down_timestamp = null;
		          self.emit('service_back', host, state);
		        }
		        else { //everything ok.
		          state.down_time_last_request = null;
		          self.emit('service_ok', host, state);
		         }
		      }
		
		      host.state = state;
		      hostsDao.updateState({_id : host._id}, host, function (err, result){
		    	  callback (err, state);
		      });
		    });
	      }
      }
  });
 };

/*-----------------------
 Starts the service
------------------------*/
WatchMen.prototype.start = function (){
 var self = this;
 self.daemon_status = 1;
 var timeoutIDs = [];
 var hosts = [];
 var count = 0;

 
 function readhostsJson(){
	 fs.readFile("./config/hosts.json", function (err, data) {
	     if (err) {
	   	  console.error("Error reading file");
	     }
	     if(data && data != undefined && data != null){
	    	 var json = JSON.parse(data);
	    	 hosts = json.hosts;
	         startWatchmen();
	     }
	  });
 }
 
 fs.watchFile("./config/hosts.json", function () {
	 count++;
	 for(var i=0; i<timeoutIDs.length; i++){
		 clearTimeout(timeoutIDs[i]);
	 }
	 readhostsJson();
 });
 
 hostsDao.updateJson();

 function launch (host){
   self.ping ({host:host}, function (err, state){
    if (err){ console.error (err); }

    if (self.daemon_status && host.count == count){
     var timeoutID = setTimeout(launch, parseInt(state.next_attempt_secs, 10) * 1000, host);
     timeoutIDs[host.index] = timeoutID;
    }
   });
 }

 function startWatchmen(){
	 for(var k=0; k<hosts.length; k++){
		 hosts[k]['index'] = k;
		 hosts[k]['count'] = count;
		 if (hosts[k].enabled !== false){
			launch(hosts[k]);
		 }
	 }
 }

 console.log('watchmen monitor started.');
};

/*-----------------------
 Stops the service
------------------------*/
WatchMen.prototype.stop = function (){
 this.daemon_status = 0;
 console.log('stopping watchmen...');
};

module.exports = WatchMen;