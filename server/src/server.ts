import Express from "express";
import Http from "http";
import Socketio from "socket.io";
import { Guid } from "guid-typescript";
import Environment from "../../client/src/environments/environment"

const http = new Http.Server(Express);
const socketIo = Socketio(http);

function generateGuid()
{
    const id:string = Guid.raw();
    return id;
}  
// When a client connects to the server...
socketIo.on("connection", function(socket:any) {
    console.log("A user has connected");
    // Send a test message.

    // When we receive a server message
    // TODO: make the namespace dynamic through persistent data.
    // Create a random GUID. 
    Environment.NameSpace = Guid.raw();
    console.log(Environment.NameSpace);
    
    socket.on("client-message", function(msg:any){
        // Print the message to console
        console.log(msg);
       

        // Test server message
        socket.emit("test", "server-message");
    });

    // When we receive a server message
    socket.on("server-message", function(msg:any){
        // Print the message to console
        console.log(msg);
    });
    
 
});

//}
// functionTest();

const server = http.listen(9090, () => {
    console.log("ddddddddddddddddd!!");
});