// CREATE TABLE Users (
//         id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//         username VARCHAR,
//         hashPass VARCHAR
// );

export interface UserData {
        id:string,
        username:string,
        hashpass:string
}
