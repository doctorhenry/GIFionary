import { IRoom } from "../interfaces/iRoom";
import User from '../models/user';

export class Room implements IRoom {
    RoomId: string;
    Users: User[];
}