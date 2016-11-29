var express = require('express');
var util = require('util');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

var fileWatcher = require('./server/fileWatcher');

app.use(express.static(__dirname + '/public'));                 // set the static files location 
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


//Handle to serve the angular app
app.get('/', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


/**
 * This would be used as a global map of sockets (Or we can call it a Socket Pool)
 * It only contains set of active sockets
 * Its structure would be like this:
 *   { 
 *     <SOCKET_ID> : {
 *          socketObject: <ACTUAL_SOCKET_OBJ>,
 *          sessionData : {
 *             <KEY_1> : <VALUE_1>
 *             <KEY_2> : <VALUE_2>
 *             :
 *             <KEY_N> : <VALUE_N>
 *          }
 *      }
 *   }
 */
var sockets = {};


/**
 * Code for socket connections and events
 */
io.on('connection', function (socket) {

  //Put the newly connected socket into the pool of sockets
  sockets[socket.id] = {  
     socketObject: socket,    //Actual socket object
     sessionData: {}          //We can maintain session for the socket here
  };


  //Handling the event when a socket (user) disconects
  socket.on('disconnect', function () {
    console.log('user disconnected');
    if(sockets[socket.id]) {
        if(sockets[socket.id].sessionData.fileName) {
           fileWatcher.unWatchFile (sockets[socket.id].sessionData.fileName); //Stop watching file for the socket connection
        }
        delete sockets[socket.id];                             //delete the socket from the existing socket-pool
    }
  });


  //Handling the event when a user wants to start watching a particular File
  socket.on('watchFile', function(fileName) {
    sockets[socket.id].sessionData.fileName = fileName;   //Set fileName as session data for the socket
    fileWatcher.watchFile(fileName, socket);              //Start watching requested file for the socket
  });


  //Handling the event when a user wants to discontinue watching a File
  socket.on('unWatchFile', function(fileName) {
    fileWatcher.unWatchFile (socket, fileName);             //Stop watching file for the socket connection
    delete sockets[socket.id].sessionData.fileName; // Un-set the fileName from session data
  });

});



//Start listening for user requests on PORT 8080
server.listen(8080, function() {
    console.log("App listening on port 8080");
});

//  /Users/bharat/Downloads/test.txt

