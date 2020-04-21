import User from "./user";

export default class Player extends User {
    constructor(username: string) {
        super();
        this.Username = username;
    }

    IsReady: boolean = false;
}