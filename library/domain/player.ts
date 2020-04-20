import { IUser } from '../interfaces/iuser';

export class Player implements IUser {
    Username: string;
    Points: number;
}