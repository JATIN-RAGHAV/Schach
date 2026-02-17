import { ElysiaWS } from 'elysia/ws';
import { color } from '../../common/interfaces/enums';


export type userQueue = Set<string>;
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
export interface gameQueueObject {
    userId: string;
    username: string;
    ws: ElysiaWS;
}
export type gameObjectQueue = Record<
    color,
    Record<string, Map<string, gameQueueObject>>
>;
export interface gameObject{
    board:null
    moveNumber:number
    whiteUserId:string
    blackUserId:string
}
