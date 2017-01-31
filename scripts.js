
// !!!!!!!!!! WEBSOCKET SECTION !!!!!!!!!!!!!!

//index.js is our websocket server. it does on and emit and only listens to socket connections. this is on port8080
//second server is static-server. you. can go to port8081 and see all the contents. it serves static files. 8081 will serve up index.html
//Use 8081 to get HTML and scripts. One of those files will contain a request to connect to 8080.

var socketio = io.connect('http://127.0.0.1:8080');

	// listen to the 'users' event
	// socket talks to server, server talks to everyone. sockets don't talk to each other
	socketio.on('users', (socketUsers)=>{
		// call back fxn passing into it socketUsers
		// socketUsers will include ID and name
		console.log(socketUsers);
		var newHTML = "";
		socketUsers.map((currSocket, index)=>{
			newHTML +='<li class="user">' + currSocket.name + '</li>';
		});
		document.getElementById('userName').innerHTML = newHTML;
	});
	// event is messageToClient
	socketio.on('messageToClient',(messageObject)=>{
		document.getElementById('userChats').innerHTML += '<div class="message">' + messageObject.message + ' -- ' + messageObject.date + '</div>';
	});






// !!!!!!!!!! CLIENT SECTION !!!!!!!!!!!!!!
	function sendChatMessage(){
		event.preventDefault();
		// extract value from chat-message and assign it to value
		//we need to handle messageToServer. Tell it where to put it.
		var messageToSend = document.getElementById('chat-message').value;
		socketio.emit('messageToServer',{
			message: messageToSend,
			name: "Anonymous"
		});
		//Reset form after submit
		document.getElementById('chat-message').value = "";
	}







// !!!!!!!!!! CANVAS SECTION !!!!!!!!!!!!!!
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Set up base options
var color = "#000";
var thickness = 10;
var mouseDown = false;
var mousePosition = {};
var lastMousePosition = null;//follow mouse track

canvas.addEventListener('mousedown', (event)=>{
	// console.log(event);
	mouseDown = true;
});

canvas.addEventListener('mouseup', (event)=>{
	// console.log(event);
	mouseDown = false;
});

canvas.addEventListener('mousemove', (event)=>{
	// console.log(event);
	if(mouseDown){
		// mouse must be down because we update this boolean in mouseDown/mouseUp
		//the x and y values are based on the entire page, not just the area within the box
		var magicBrushX = event.pageX - canvas.offsetLeft;
		var magicBrushY = event.pageY - canvas.offsetTop;
		mousePosition = {
			x: magicBrushX,
			y: magicBrushY
		}
		console.log(mousePosition);
		if(lastMousePosition !== null){
			context.strokeStyle = color;
			context.lineJoin = 'round';
			context.lineWidth = thickness;
			context.beginPath();//where to start drawing
			context.moveTo(lastMousePosition.x, lastMousePosition.y);//where to draw
			context.lineTo(mousePosition.x, mousePosition.y);
			context.stroke();//Actually drawing
			context.closePath();//closes path
		}

		// update lastMousePosition with currentMousePosition
		lastMousePosition = {
			x: mousePosition.x,
			y: mousePosition.y
		}
	}
});