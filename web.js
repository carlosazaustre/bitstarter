var express = require('express')
,		fs 			= require('fs')
,		app			= express.createServer(express.logger());

// Function to read a file stream
var readFile = function(filename) {
  var _file = fs.readFileSync(filename);
  var _buffer = new Buffer(_file);
  return _buffer.toString();
};

app.get('/', function(request, response) {
  response.send(readFile('index.html'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
