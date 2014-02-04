/**
 * Configuration for application
 */

module.exports = {
	database : 'mongodb',
    mongo : {
        host : "localhost",
        port : 27017,
        db : "alertme",
        opts : {
            "auto_reconnect": true,
            "safe": true
        }
    },
    tingo : {
        "dbPath":"C:/tingoDB/data"
    },
	app : {
		name : 'alertme',
		hostname : 'localhost',
		port : 3333
	},
	credentials : {
		username : "admin",
		password : "admin"
	},
	mail : {
		apiKey : 'key-3lfx4-72cylett1ksl8t26ijch1hk8o4',
		from : 'rberts321@gmail.com',
		subject : 'AlertMe'
	}
};