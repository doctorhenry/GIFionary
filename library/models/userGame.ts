import User from "./user";
import Gif from "./gif";

export default class UserGame {
    OtherPlayers: User[] = [];
    Gifs: Gif[] = [];
    ThisPlayer?: User = undefined;
}