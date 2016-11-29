var fs = require('fs');
var buffer = new Buffer(1024);

var watchFile = function (fileName, socket) {
	fs.watchFile(fileName, { persistent: true, interval: 2007 }, function(curr, prev){
		var prevModifiedTime = new Date(prev.mtime).getTime();
		var currModifiedTime = new Date(curr.mtime).getTime();
		if(currModifiedTime > prevModifiedTime) { //means file has been (not just accessed)
			fs.open('/Users/bharat/Downloads/test.txt', 'r', (err, fd) => {
			   if(err) {
			   	   console.log('ERROR occurred while opening file in read mode. DETAILED err: ', err);
			   	   socket.emit('error', {matter: err});
			   }
			   else {
			   	   var position = prev.size;
			   	   fs.read(fd, buffer, 0, buffer.length, position, function(err, bytesRead) {
			   	      if(err) {
			   	         console.log('ERROR occurred while reading file. DETAILED err: ', err);
			   	         socket.emit('error', {matter: err});
			   	      }
			   	      if(bytesRead > 0){
			   	      	 var newData = buffer.slice(0, bytesRead).toString();
				         console.log("newData=> ", newData);
				         socket.emit('fileChanged', {matter: newData});
				      }
			   	      fs.close(fd);
			   	   });
			   }
			});
		} 
	});
}

module.exports = {
	watchFile: watchFile
}