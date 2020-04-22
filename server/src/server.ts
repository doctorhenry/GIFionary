import Express, { json } from "express";
import Http from "http";
import Socketio, { Socket, Room } from "socket.io";
import { Guid } from "guid-typescript";
import SocketEvents from "../../library/constants/socketEvents";
import ConnectedUser from "../../library/models/connectedUser";
import UserGame from "../../library/models/userGame";
import Axios, { AxiosResponse } from "axios";
import Gif from "../../library/models/gif";

const http = new Http.Server(Express);
const socketIo = Socketio(http);

const getTrendingGifs = (numberOfPlayers: number) => {
    const limitAmount = numberOfPlayers * 8;
    const randomPosition = Math.random() * (100 - 1) + 1;

    return Axios.get(`https://api.tenor.com/v1/trending?keyLIVDSRZULELA&limit=${limitAmount}&post=${randomPosition}`);
}

const server = http.listen(9090, () => {

    let roomId: string = null;

    let users: ConnectedUser[] = [];
    let sockets: Socket[] = [];
    let rooms: string[] = [];

    let allUsersReady: boolean = false;

    socketIo.on(SocketEvents.Connection, (socket: Socket) => {
        // TODO: make the namespace dynamic through persistent data.

        sockets.push(socket);

        console.log(socket.id);

        socket.on(SocketEvents.JoinGame, (username: string) => {

            let joinSuccess: boolean = true;

            if (username && users.every(user => user.Username !== username)) {
                const user = new ConnectedUser(username, socket.id);
                users.push(user);

                socket.join(roomId);
            } else {
                joinSuccess = false;
            }

            socket.emit(SocketEvents.JoinResult, roomId);
        });

        socket.on(SocketEvents.CreateGame, (username: string) => {
            let joinSuccess: boolean = true;

            if (username && users.every(user => user.Username !== username)) {
                roomId = Guid.raw();

                const user = new ConnectedUser(username, socket.id);
                users.push(user);
                rooms.push(roomId);

                socket.join(roomId);
            } else {
                joinSuccess = false;
            }

            socket.emit(SocketEvents.JoinResult, joinSuccess);
        });

        socket.on(SocketEvents.UserReady, (username: string) => {
            const currentUser = users.find(user => user.Username === username);

            if (currentUser) {
                currentUser.IsReady = true;

                allUsersReady = users.every(user => user.IsReady) && users.length > 1;

                console.log(username);
                console.log(allUsersReady);

                if (allUsersReady) {
                    const userGame = new UserGame();

                    // By default set the first person to the Decider
                    users[0].CanPlay = true;

                    userGame.Users = users;

                    getTrendingGifs(users.length).then((response: AxiosResponse<any>) => {
                        let allGifs = mapTenorApiCallToGifs(response.data.results);

                        users.forEach(user => {
                            const userSocket = sockets.find(socket => socket.id === user.SocketId);

                            userGame.Gifs = allGifs.splice(0, 8);
                            
                            userSocket.emit(SocketEvents.GameUpdate, userGame);

                            if (user.CanPlay) {
                                userSocket.emit(SocketEvents.CanPlay);
                            }
                        });
                    });
                }
            }
        });
    });
});

const mapTenorApiCallToGifs = (gifsFromApi: any[]): Gif[] => {
    return gifsFromApi.map((gif: any, index: number) => new Gif(index, gif.media[0].gif.url));
}