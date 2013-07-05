'use strict';

var express = require('express'),
	fs		= require('fs'),
	app 	= express.createServer(express.logger());

var indexFile = fs.readFileSync('index.html');
var buffer = new Buffer(indexFile);

app.get('/', function(request, response) {
  response.send(buffer.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
