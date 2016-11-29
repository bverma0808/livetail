var express = require('express');
var util = require('util');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

var fileWatcher = require('./server/fileWatcher');

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.get('/', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

var sockets = {};

io.on('connection', function (socket) {
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
  // console.log("socket=> ", util.inspect(socket));
  // socket.on('connect', function () {
  //   console.log('user connected');
  // });

  socket.on('disconnect', function () {
    // delete sockets[socket.id]
    console.log('user disconnected');
  });

  fileWatcher.watchFile('/Users/bharat/Downloads/test.txt', socket);
});

server.listen(8080, function() {
    console.log("App listening on port 8080");
});