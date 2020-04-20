import Express from "express";
import Http from "http";
import Socketio, { Socket } from "socket.io";
import { Guid } from "guid-typescript";
import SocketEvents from '../../library/constants/socketEvents';
import { Player } from '../../library/domain/player'

const http = new Http.Server(Express);
const socketIo = Socketio(http);

let roomId: string = null;

let roomIds: string[] = [];

socketIo.on(SocketEvents.Connection, (socket: Socket) => {
    // TODO: make the namespace dynamic through persistent data.
    // Create a random GUID. 

    socket.on(SocketEvents.JoinGame, (username: string) => {
        socket.join(roomId);

        socket.emit(SocketEvents.JoinResult, roomId);
    });

    socket.on(SocketEvents.CreateGame, (username: string) => {
        roomId = Guid.raw();

        console.log(roomId);
        console.log(username);

        const player = new Player();
        player.Username = username;
        
        socket.join(roomId);

        console.log("success");

        socket.emit(SocketEvents.JoinResult, roomId);
    });
    
});

const server = http.listen(9090, () => {

});