import ConnectedUser from "./connectedUser";

export default class Room {
    RoomId: string;
    Users: ConnectedUser[] = [];
    AllUsersAreReady = () => this.Users.every(user => user.IsReady) && this.Users.length > 1;
}