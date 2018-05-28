
var http = require('http');
var express = require('express');
var fs = require('fs');
var url = require('url');
var searcherCreater = require('./acronymService/searcher');


var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var index = require('./routes/index');




app.use(express.static('../public'));
app.use('/', index);

app.get('/lol', function (req, res) {
  res.send('<h1>Hello World</h1>');
 })

app.post('/', function (req, res) {
  var searcher = new searcherCreater(req.body.text);
  searcher.search();
  res.end();
 })
 
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("app listening at http://%s:%s", host, port)
 })

// var eventEmitter = require('events');
// console.log(eventEmitter.prototype.on == eventEmitter.prototype.addListener);

// var server = http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end('Hello World!');
    
// });
// server.listen(8080);

