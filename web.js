// Define routes for simple SSJS web app.
// Writes Coinbase orders to database.
var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http');

var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));

// Render homepage (note trailing slash): example.com/
app.get('/', function(request, response) {
  var data = fs.readFileSync('index.html').toString();
  response.send(data);
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Listening on " + app.get('port'));
});
