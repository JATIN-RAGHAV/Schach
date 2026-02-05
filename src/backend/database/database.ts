import postgres from "postgres";

const database_url = Bun.env.DATABASE_URL;
const host = Bun.env.HOST;
const port:number = +(Bun.env.PORT?Bun.env.PORT:5432);
const database = Bun.env.DATABASE;
const username = Bun.env.USERNAME;
const password = Bun.env.PASSWORD;
const psql = postgres(database_url?database_url:"",{
        host,
        port,
        database,
        username,
        password,
});

class Data{
        static async setup(){
                console.log("Started setting up")
                const file = Bun.file("src/backend/database/SETUP.sql")
                const command = await file.text();
                const response = await psql`${command}`;
                return response;
        }
        static async add(username:string, hashPass:string){
                const response = await psql`INSERT INTO Users (username,hashPass) VALUES(${username},${hashPass})`
                return response;
        }
        static async get(username:string){
                const response = await psql`SELECT * FROM Users WHERE username = ${username}`
                return response;
        }
        static async end(){
                psql.end()
        }
}

export default Data;
