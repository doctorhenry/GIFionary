import ConnectedUser from "./connectedUser";
import UserRoomDetail from "../../../library/models/userRoomDetail";
import Story from "./story";

export default class ConnectedRoom extends UserRoomDetail {
    constructor(roomId: string, playerCount: number, hostedBy: string) {
        super();
        this.RoomId = roomId;
        this.PlayerCount = playerCount;
        this.HostedBy = hostedBy;
        this.Users = [];
    }

    Users: ConnectedUser[];
    CurrentStory: Story = new Story();
    AllUsersAreReady = () => this.Users.every(user => user.IsReady) && this.Users.length > 2;
}