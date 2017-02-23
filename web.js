
var express = require('express'),
	app = express();

console.log('Server starting at port:' + (process.env.PORT || process.env.FE_PORT || 8081));

app.use('/',express.static(__dirname + '/app'));

app.listen(process.env.PORT || process.env.FE_PORT || 8081);
