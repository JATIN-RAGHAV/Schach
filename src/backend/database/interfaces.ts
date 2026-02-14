import { ElysiaWS } from "elysia/ws"
import { color } from "../../common/interfaces/enums"

export interface UserData {
        id:string,
        username:string,
        hashpass:string
}

export interface userGameObject{
        userId:string,
        username:string,
        ws:ElysiaWS
}

export type gameQueueObject = Record<
color,
Record<
string,
userGameObject[]>
>
