import Express from "express";
import Http from "http";
import Socketio from "socket.io";

const http = new Http.Server(Express);
const socketIo = Socketio(http);

//var functionTest = function(){ 
  
// When a client connects to the server...
socketIo.on("connection", function(socket:any) {
    console.log("A user has connected");
    // Send a test message.
    socket.emit("test", "server-message");

    // When we receive a server message
    socket.on("client-message", function(msg:any){
        // Print the message to console
        console.log(msg);
    });

    // When we receive a server message
    socket.on("server-message", function(msg:any){
        // Print the message to console
        console.log(msg);
    });
    
    // dynamic name generation...
    // socketIo.join()
});

//}
// functionTest();

const server = http.listen(9090, () => {
    console.log("ddddddddddddddddd!!");
});