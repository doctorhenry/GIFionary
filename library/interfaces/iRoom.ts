import User from '../models/user';

export interface IRoom {
    RoomId: string;
    Users: User[];
}