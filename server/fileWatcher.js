var fs = require('fs');
var async = require('async');
var buffer = new Buffer(1024);

/**
 * Function to start watching a file
 * @param1: <String> , name of file to be watched
 * @param2: <Object> , Of class Socket
 */
var watchFile = function (fileName, socket) {

	async.waterfall([
		   //check whether the file exists or not
		   function(next) {
		   	    fs.stat(fileName, function(err, stat) {
				    if(err == null) {
				        console.log('File exists');
				        next();
				    } 
				    else {// file does not exist
				    	next(err);
				    }
				});
		   },

           //Start watching file
		   function(next){
		   	    console.log('Watcher started for: ', fileName);
			    socket.emit('watchBegins', {fileName: fileName});

				//Start watching a file
				fs.watchFile(fileName, { persistent: true, interval: 1007 }, function(curr, prev){
					//curr and prev are the File STATS object where 'curr' is new state of the file and 'prev' is old state.
					var prevModifiedTime = new Date(prev.mtime).getTime();
					var currModifiedTime = new Date(curr.mtime).getTime();

					if(currModifiedTime > prevModifiedTime) { //means file has been actually modified (not just accessed)

						//Open the file in read mode
						fs.open(fileName, 'r', (err, fd) => {
						   if(err) {
						   	   console.log('ERROR occurred while opening file in read mode. DETAILED err: ', err);
						   	   socket.emit('error', {matter: err});
						   }
						   else {
						   	   var position = prev.size; //Always start reading the file from the point which happened to be the file end in old state
						   	   //Read file form last
						   	   fs.read(fd, buffer, 0, buffer.length, position, function(err, bytesRead) {
						   	      if(err) {
						   	         console.log('ERROR occurred while reading file. DETAILED err: ', err);
						   	         socket.emit('error', {matter: err});
						   	      }
						   	      if(bytesRead > 0){ //If there is something to broadcast
						   	      	 var newData = buffer.slice(0, bytesRead).toString();
							         socket.emit('fileChanged', {matter: newData, time: new Date().getTime()}); //Broadcast it
							      }
						   	      fs.close(fd);  //close the file
						   	   });
						   }
						});
					} 
				});
                next();
		   }
		],
		function (err){
			if(err) {
				if(err.code == 'ENOENT') {    
			        socket.emit('fileNotFound', {matter: 'Specified file is not present at the path'});
				} 
			    else {
			        socket.emit('error', err);
			    }
			}
	    }
	);
}

/**
 * Function to unwatch a file
 * @param : <String> , filename that needs to be discontinued from watching
 */
var unWatchFile = function(socket, fileName) {
	//You know what the cool thing about this function
	//Calling fs.unwatchFile() with a filename that is not being watched is a no-op, not an error.
	fs.unwatchFile(fileName);
	socket.emit('watchEnds', {fileName: fileName});
	console.log('Watcher stopped for: ', fileName);
}


//Export the function, so that they can be used outside of this file
module.exports = {
	watchFile: watchFile,
	unWatchFile: unWatchFile
}
