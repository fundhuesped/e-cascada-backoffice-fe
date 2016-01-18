
var express = require('express'),
	app = express();
var http = require('http');

console.log("Server starting at port:8081");

app.use('/',express.static(__dirname + '/app'));

app.listen(process.env.PORT || 8081);
