import Express from "express";
import Http from "http";
import Socketio, { Socket, Room } from "socket.io";
import { Guid } from "guid-typescript";
import SocketEvents from "../../library/constants/socketEvents";
import Player from "../../library/models/player";
import Https from "https";
import UserGame from "../../library/models/userGame";

const http = new Http.Server(Express);
const socketIo = Socketio(http);

const getTrendingGifs = () => {
    return Https.get("api.giphy.com/v1/gifs/random");
}

const server = http.listen(9090, () => {

    let roomId: string = null;

    let players: Player[] = [];

    let allPlayersReady: boolean = false;

    socketIo.on(SocketEvents.Connection, (socket: Socket) => {
        // TODO: make the namespace dynamic through persistent data.
        // Create a random GUID. 

        // I thought anything within the context of the current socket was bound to a specific user's connection, I guess not. This doesn't work.
        let currentPlayerUsername: string = "";

        socket.on(SocketEvents.JoinGame, (username: string) => {

            let joinSuccess: boolean = true;

            if (username && players.every(player => player.Username !== username)) {
                const user = new Player(username);
                players.push(user);

                currentPlayerUsername = username;

                socket.join(roomId);
            } else {
                joinSuccess = false;
            }

            socket.emit(SocketEvents.JoinResult, roomId);
        });

        socket.on(SocketEvents.CreateGame, (username: string) => {
            let joinSuccess: boolean = true;

            if (username && players.every(player => player.Username !== username)) {
                roomId = Guid.raw();

                const user = new Player(username);
                players.push(user);

                currentPlayerUsername = username;

                socket.join(roomId);
            } else {
                joinSuccess = false;
            }

            socket.emit(SocketEvents.JoinResult, joinSuccess);
        });


        socket.on(SocketEvents.UserReady, () => {

            const currentPlayer = players.find(player => player.Username === currentPlayerUsername);

            if (currentPlayer) {
                currentPlayer.IsReady = true;

                allPlayersReady = players.every(player => player.IsReady) && players.length > 1;

                if (allPlayersReady) {
                    const userGame = new UserGame();

                    console.log(players);

                    players[0].CanPlay = true;

                    userGame.OtherPlayers = players.filter(player => player.Username !== currentPlayerUsername);
                    userGame.ThisPlayer = players.find(player => player.Username === currentPlayerUsername);

                    console.log(userGame.ThisPlayer);

                    socketIo.emit(SocketEvents.GameReady, userGame);
                }
            }
        });
    });


});

/*
Game Object
    - State
    - Players
    - Room
*/