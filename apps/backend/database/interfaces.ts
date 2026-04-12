import { ElysiaWS } from 'elysia/ws';
import { color } from '@schach/common/interfaces/enums';


export type usersWaiting = Set<string>;
export type userOppo = Map<string,string>;

export type userIdWebSocket = Map<string,{
    socket:ElysiaWS,
    color:color
}>;
export interface UserData {
    id: string;
    username: string;
    hashpass: string;
}
export interface userWaitingObject {
    userId: string;
    username: string;
    ws: ElysiaWS;
}
// Maps colors to a map of time:increment to a user with that color and time:increment
export type gameWaitingObject = Record<
    color,
    Record<string, userWaitingObject>
>;
