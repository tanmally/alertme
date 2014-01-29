var config = require("../config/config");
var Mailgun = require('mailgun').Mailgun;

exports.sendEmail = function (params) {
	var mg = new Mailgun(config.mail.apiKey);
	var to = [];
	
	if((params.to.indexOf(',') > -1)){
		to = params.to.split(",");
	} else {
		to.push(params.to);
	}
	
	mg.sendRaw(config.mail.from, to,
	        'From: ' + config.mail.from +
	          '\nTo: ' + params.to +
	          '\nContent-Type: text/html; charset=utf-8' +
	          '\nSubject: ' + config.mail.subject +
	          '\n\n' + params.message,
	        function(error, response) { 		   
			   if(error){
			       console.log(error);
			   }else{
			       console.log("Message sent");
			   } 
			});
};



