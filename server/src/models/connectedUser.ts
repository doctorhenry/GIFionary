import User from "../../../library/models/user";

export default class ConnectedUser extends User {
    constructor(username: string, socketId: string) {
        super();
        this.Username = username;
        this.SocketId = socketId;
    }

    IsReady: boolean = false;
    SocketId: string = "";
    CanPlay: boolean = false;
}