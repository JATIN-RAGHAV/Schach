// CREATE TABLE Users (
//         id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//         username VARCHAR,
//         hashPass VARCHAR
// );

import { ElysiaWS } from "elysia/ws"

export interface UserData {
        id:string,
        username:string,
        hashpass:string
}

export interface GameList{
        userId:string,
        username:string,
        ws:ElysiaWS
}
