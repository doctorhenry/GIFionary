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
import PlayedGif from "../../library/models/playedGif";
import UserRound from "../../library/models/userRound";
import User from "../../library/models/user";
import { UserType } from "../../library/enums/userType";

const http = new Http.Server(Express);
const socketIo = Socketio(http);

const getTrendingGifs = (numberOfPlayers: number) => {
    const limitAmount = numberOfPlayers * 8;
    const randomPosition = Math.random() * (100 - 1) + 1;

    return Axios.get(`https://api.tenor.com/v1/trending?keyLIVDSRZULELA&limit=${limitAmount}&post=${randomPosition}`);
}

const server = http.listen(9090, () => {
});

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

            const thisPlayer = new ConnectedUser(username, socket.id);
            thisPlayer.UserType = UserType.Decider;

            room.Users.push(thisPlayer);
            rooms.push(room);

            socket.join(room.RoomId);

            result.Data = room.RoomId;
        } else {
            result.IsSuccess = false;
        }

        socket.emit(SocketEvents.CreateResult, result);
    });

    // Join an existing room
    socket.on(SocketEvents.JoinGame, (username: string, roomId: string) => {
        const result = new ValidationResult<string>("");

        const matchingRoom = rooms.find(room => room.RoomId === roomId);

        if (username && matchingRoom && matchingRoom.Users.every(user => user.Username !== username)) {

            matchingRoom.Users.push(new ConnectedUser(username, socket.id));
            matchingRoom.PlayerCount++;

            if (matchingRoom.PlayerCount > 4) {
                console.log("no more players allowed");
                result.IsSuccess = false;
                result.Errors.push("This server has reached capacity. Please try another.");
            }
            else {
                socket.join(roomId);
                result.Data = roomId;
            }

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
                // By default set the first person to the Decider
                currentRoom.Users[0].CanPlay = true;

                getTrendingGifs(currentRoom.Users.length)
                    .then((response: AxiosResponse<any>) => {

                        let allGifs = mapTenorApiCallToGifs(response.data.results);

                        currentRoom.Users.forEach(user => {
                            const userSocket = sockets.find(socket => socket.id === user.SocketId);

                            const userGifs = allGifs.splice(0, 8);
                            console.log("yay");
                            userSocket.emit(SocketEvents.NewBatchOfGifs, userGifs);
                            userSocket.emit(SocketEvents.UsersUpdate, currentRoom.Users as User[]);
                        });
                    });
            }
        }
    });

    socket.on('disconnect', () => {
        console.log("todo");
    });

    socket.on(SocketEvents.LeaveRoom, (username: string, roomId: string) => {
        console.log("leaving room");
        const matchingRoom = rooms.find(room => room.RoomId === roomId);

        if (matchingRoom && username && roomId) {
            const matchingUser = matchingRoom.Users.find(user => user.Username === username);

            if (matchingUser) {
                socket.leave(matchingUser.SocketId);

                matchingRoom.Users.splice(matchingRoom.Users.findIndex(user => user.Username === username), 1);
                matchingRoom.PlayerCount--;
                console.log(matchingRoom.PlayerCount);

                if (matchingRoom.PlayerCount < 1) {
                    socket.emit(SocketEvents.ObliterateRoom, roomId);
                }

                //Implement "if the host leaves, then the game is closed and the room is destroyed"
            }
        }
    });

    socket.on(SocketEvents.ObliterateRoom, (roomId: string) => {
        const matchingRoomIndex = rooms.findIndex(room => room.RoomId === roomId);
        console.log("command received");
        // Destroy the room.
        socket.to(roomId).emit(SocketEvents.NavigateHome, "go home");
        socket.leave(roomId);
        console.log("room destroyed: " + roomId);
        rooms.splice(matchingRoomIndex, 1);
    });

    socket.on(SocketEvents.DeciderHandSubmit, (roomId: string, playedGif: PlayedGif) => {
        const room = rooms.find(room => room.RoomId === roomId);

        if (room) {
            const thisUser = room.Users.find(user => user.Username === playedGif.PlayerUsername);

            if (thisUser && thisUser.CanPlay) {
                room.CurrentStory.CurrentRound.PlayedGifs.push(playedGif);

                thisUser.CanPlay = false;

                for (const user of room.Users.filter(user => user !== thisUser)) {
                    user.CanPlay = true;
                }

                console.log(`room id is ${roomId}`);

                socket.to(roomId).emit(SocketEvents.RoundUpdate, room.CurrentStory.CurrentRound);
                socket.to(roomId).emit(SocketEvents.UsersUpdate, room.Users as User[]);
            } else {
                //Throw some sort of error saying "oi you dodgy hacker"
            }
        }
    });

    socket.on(SocketEvents.PlayersHandSubmit, (roomId: string, playedGif: PlayedGif) => {
        const room = rooms.find(room => room.RoomId === roomId);

        if (room) {
            const thisUser = room.Users.find(user => user.Username === playedGif.PlayerUsername);

            if (thisUser && thisUser.CanPlay) {
                room.CurrentStory.CurrentRound.PlayedGifs.push(playedGif);

                const allPlayedUsers = room.Users.filter(user => user.CanPlay);
                const allPlayedUsernames = room.CurrentStory.CurrentRound.PlayedGifs.map(gif => gif.PlayerUsername);
                const allPlayersHavePlayedThisRound = allPlayedUsers.every(playerOfType => allPlayedUsernames.find(playedUsername => playedUsername === playerOfType.Username));

                console.log(`allPlayersHavePlayedThisRound: ${allPlayersHavePlayedThisRound}`);

                if (allPlayersHavePlayedThisRound) {
                    socket.to(roomId).emit(SocketEvents.RoundUpdate, room.CurrentStory.CurrentRound);

                    const deciderPlayer = room.Users.find(user => user.UserType === UserType.Decider);

                    if (deciderPlayer) {
                        deciderPlayer.CanPlay = true;
                        deciderPlayer.CanDecide = true;
                    } else {
                        console.log("No Decider was found. Damn this over-complicated rscode!");
                    }
                }

                thisUser.CanPlay = false;

                socket.to(roomId).emit(SocketEvents.UsersUpdate, room.Users as User[]);
            } else {
                //TODO: Error for hacky bois
            }

        }
    });
});

const mapTenorApiCallToGifs = (gifsFromApi: any[]): Gif[] => {
    return gifsFromApi.map((gif: any, index: number) => <Gif>{ Id: index, Url: gif.media[0].gif.url });
}