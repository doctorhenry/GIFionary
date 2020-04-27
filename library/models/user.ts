import { UserType } from "../enums/userType";

export default class User {
    Username: string = "";
    Avatar: string = "";
    CanPlay: boolean = false;
    CanDecide: boolean = false;
    Points: number = 0;
    UserType: UserType = UserType.Player;
}