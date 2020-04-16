import Express from "express";
import Http from "http";
import Socketio from "socket.io";

const http = new Http.Server(Express);
const socketIo = Socketio(http);

var functionTest = function(){ 
    http.listen(3000, () => {
        console.log("ddddddddddddddddd!!");
    });
    
    socketIo.on("connection", socket => {
        socket.emit("test", "super secret value");
    });
}
functionTest();