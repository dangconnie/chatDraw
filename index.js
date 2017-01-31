//In this folder on command line, run by typing nodemon. It starts by looking at package.json to look for "main" to know where to start. In this case, it is index.js. Nodemon will watch for file changes.Will automatically refresh. 
//Index.js is our node server. It only handles the HTTP request, not socket. This is where our node is. 

//If you have a .emit on one side, you need a .on on the other side and vice versa

// console.log("Sanity check!");


//Include http and fs
var http = require("http");
var fs = require('fs');

var server = http.createServer((req,res)=>{
	// console.log("Someone connected via HTTP");
	// fs.readFile('index.html', 'utf-8',(error, fileData)=>{
	// 	if(error){
			// respond with a 500 error
			// res.writeHead(500,{'content-type':'text/html'});
			//Giving user the error they got to help them out
			// res.end(error);
		// }else{
			// the file was able to be read in
	// 		res.writeHead(200,{'content-type':'text/html'});
	// 		res.end(fileData);
	// 	}
	// });
});



// Include the server version of socketIO and assign it to a variable
var socketIo = require('socket.io');
// sockets are going to listen to the server which is listening on port 8080
var io = socketIo.listen(server);

var socketUsers = [];

//Handle socket connections with event handler...
//'Connect' is part of sockets. "Let me know when sockets connect. When someone connects to 'sockets', run this code."
//.on = i'm listening for...
//.emit = i'm going to send out...

io.sockets.on('connect', (socket)=>{
	console.log("Someone connected by socket");
	socketUsers.push({
		socketID: socket.id,
		name: "Anonymous"
	})
	//Emit 'users' and send socketUsers along with it. Tell all the sockets the 'users' event(emit) and send the socketUsers along with it.
	//All listeners go inside connect. When someone connects, you only get the notice once. Listen to everyone for events. Add listener to that socket.
	io.sockets.emit('users', socketUsers);

	// when a message is sent, we turn it around and emit it to all sockets
	socket.on('messageToServer', (messageObject)=>{
		console.log("Someone sent a message. It is" , messageObject.message);
		io.sockets.emit("messageToClient",{
			message: messageObject.message,
			date: new Date()
		});
	});

});




server.listen(8080);
console.log("Listening on port 8080...");