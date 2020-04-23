import Express, { json } from "express";
import Http from "http";
import Socketio, { Socket } from "socket.io";
import { Guid } from "guid-typescript";
import SocketEvents from "../../library/constants/socketEvents";
import ConnectedUser from "./models/connectedUser";
import ConnectedRoom from "./models/connectedRoom";
import UserGame from "../../library/models/userGame";
import Axios, { AxiosResponse } from "axios";
import Gif from "../../library/models/gif";
import UserRoomDetail from "../../library/models/userRoomDetail";
import ValidationResult from "../../library/models/validationResult";

const http = new Http.Server(Express);
const socketIo = Socketio(http);

const getTrendingGifs = (numberOfPlayers: number) => {
    const limitAmount = numberOfPlayers * 8;
    const randomPosition = Math.random() * (100 - 1) + 1;

    return Axios.get(`https://api.tenor.com/v1/trending?keyLIVDSRZULELA&limit=${limitAmount}&post=${randomPosition}`);
}

const server = http.listen(9090, () => {

    let rooms: ConnectedRoom[] = [];
    let sockets: Socket[] = [];

    socketIo.on(SocketEvents.Connection, (socket: Socket) => {

        sockets.push(socket);

        // Show the rooms
        socket.on(SocketEvents.GetRooms, () => {
            socket.emit(SocketEvents.ShowRooms, rooms as UserRoomDetail[]);
        });

        // Create a new game/room and join it
        socket.on(SocketEvents.CreateGame, (username: string) => {
            const result = new ValidationResult<string>("");

            if (username) {
                const room = new ConnectedRoom(Guid.raw(), 1, username);

                room.Users.push(new ConnectedUser(username, socket.id));
                rooms.push(room);

                socket.join(room.RoomId);

                result.Data = room.RoomId;
            } else {
                result.IsSuccess = false;
            }

            socket.emit(SocketEvents.JoinResult, result);
        });

        // Join an existing room
        socket.on(SocketEvents.JoinGame, (username: string, roomId: string) => {
            const result = new ValidationResult<string>("");

            const matchingRoom = rooms.find(room => room.RoomId === roomId);

            if (username && matchingRoom && matchingRoom.Users.every(user => user.Username !== username)) {

                matchingRoom.Users.push(new ConnectedUser(username, socket.id));
                matchingRoom.PlayerCount++;
                
                socket.join(roomId);
                result.Data = roomId;
            } else {
                result.IsSuccess = false;
            }

            socket.emit(SocketEvents.JoinResult, result);
        });

        socket.on(SocketEvents.UserReady, (username: string, roomId: string) => {
            const currentRoom = rooms.find(r => r.RoomId === roomId);
            const currentUser = currentRoom && currentRoom.Users.find(user => user.Username === username);

            if (currentRoom && currentUser) {
                currentUser.IsReady = true;

                if (currentRoom.AllUsersAreReady()) {
                    const userGame = new UserGame();

                    // By default set the first person to the Decider
                    currentRoom.Users[0].CanPlay = true;

                    userGame.Users = currentRoom.Users;

                    getTrendingGifs(userGame.Users.length)
                        .then((response: AxiosResponse<any>) => {

                            let allGifs = mapTenorApiCallToGifs(response.data.results);

                            currentRoom.Users.forEach(user => {
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

        socket.on(SocketEvents.LeaveRoom, (username: string, roomId: string) => {
            const matchingRoom = rooms.find(room => room.RoomId === roomId);

            if (matchingRoom && username && roomId) {
                const matchingUser = matchingRoom.Users.find(user => user.Username === username);

                socket.leave(matchingUser.SocketId);

                matchingRoom.Users.splice(matchingRoom.Users.findIndex(user => user.Username === username), 1);
                matchingRoom.PlayerCount--;

                //Implement "if the host leaves, then the game is closed and the room is destroyed"
            }
        });
    });
});

const mapTenorApiCallToGifs = (gifsFromApi: any[]): Gif[] => {
    return gifsFromApi.map((gif: any, index: number) => new Gif(index, gif.media[0].gif.url));
}