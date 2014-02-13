/**
 * Configuration for application
 */

module.exports = {
	database : 'tingodb',
    mongo : {
        host : "localhost",
        port : 27017,
        db : "alertme",
        opts : {
            "auto_reconnect": true,
            "safe": true
        },
        username : "admin",
        password : "123"
    },
    tingo : {
        "dbPath":"/dockcloud/data"
    },
	app : {
		name : 'alertme',
		hostname : '0.0.0.0',
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
