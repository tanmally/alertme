var http = require('http');
var https = require('https');

/*---------------
 Apply validation rules to a HTTP request to determine if it is valid.
 Valid status code, expected text.
-----------------*/
function validate_http_response (host, body, res){
  if (host.config.expectedData){
    if (res.statusCode != host.config.expectedStatuscode){
      return 'FAILED! expected status code :' + host.config.expectedStatuscode +
        ' at ' + host.config.url + ' but got ' + res.statusCode;
    }
    else if (host.config.expectedData && (!body ||
        (body.indexOf(host.config.expectedData)==-1))){
      return 'FAILED! expected text "' + host.config.expectedData +
        '" but it wasn\'t found';
    }
    else{
      return ''; //ok
    }
  }
  return ''; //nothing to check for
}


function ping (host, callback){
  // record start time
  var startTime = new Date();

  var method = host.config.method;
  if (!host.config.expectedData){
    method = "HEAD";
  }

  var options = {
    port: host.port,
    host: host.host,
    path: host.config.url,
    method: method,
    agent:false
  };

  var request;
  if(host.config.ping_service === "https") {
    request = https.request(options);
    https.globalAgent.maxSockets=500;
  } else  {
    request = http.request(options);
    http.globalAgent.maxSockets=500;
  }

  var handled_callback = false;
  var error = null;

  request.setTimeout((host.config.timeout * 1000) || 10000, function(){
    if (!handled_callback){
      handled_callback = true;
      callback('Timeout');
    }
  });

  request.addListener('error', function(connectionException){
    error = connectionException.errno || 'Error establishing connection';
    if (!handled_callback){
      handled_callback = true;
      callback(error);
    }
  });

  request.on('response', function(response) {
    response.setEncoding('utf-8');
    var body = '';

    response.on('data', function(chunk) {
      body += chunk;
    });

    response.on('end', function() {
      var timeDiff = (new Date() - startTime);
      if (!handled_callback){
        handled_callback = true;
        callback(validate_http_response(host, body, response), body, response, timeDiff);
      }
    });

    response.on('error', function(e) {
      error = e.message;
    });
  });

  request.on('error', function(e) {
    if (!handled_callback){
      handled_callback = true;
      callback(e.message + '. Details :' + host.host + host.config.url);
    }
  });

  request.write(JSON.stringify(host.config.input_data) || '');
  request.end();
}

module.exports.ping = ping;