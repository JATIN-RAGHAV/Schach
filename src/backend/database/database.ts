import postgres from "postgres";
import { UserFindingError, UserNotCreated, UserNotFound, UserPassWrong } from "../helper/errors";
import type { JWT_PAYLOAD } from "../interfaces/jwt_payload";
import type { UserData } from "./interfaces";

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

// Connection checking
try {
    await psql`SELECT 1 as health_check`;
    console.log('Database connected successfully');
} catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
}

class Data{

        static async getUser(username:string):Promise<UserData>{
                try{
                        const users = await psql<UserData[]>`SELECT * FROM Users WHERE username = ${username}`
                        if(users[0] == undefined){
                                throw new UserNotFound()
                        }

                        return users[0]
                }
                catch (error){
                        throw new UserNotFound();
                }
        }

        static async createUser(username:string, pass:string):Promise<JWT_PAYLOAD>{
                const hashPass:string = Bun.password.hashSync(pass)
                try{
                        await psql<UserData[]>`INSERT INTO Users (username,hashPass) VALUES(${username},${hashPass})`

                        const user = await this.getUser(username)
                        if(!(user instanceof Error)){
                                return {
                                        username:user.username,
                                        userId:user.id
                                }
                        }
                        throw new UserNotCreated();
                }
                catch (error: any){
                        
                        // ========= Missing Tables/ Table Not Created ===========
                        if (error.code === '42P01'){
                            console.log("[DATABSE ERROR]: Tables does not exist. Please create corresponding tables")
                            // console.log(error)
                            console.log("Running table creating...")
                            this.initDB()

                            throw new Error("DATABSE Table DNE Error");
                        }

                        // =========== 2. Duplicate Username (User Error) ========
                        if (error.code === '23505') {
                            console.warn(`User creation failed: Username '${username}' already exists.`);
                            throw new UserNotCreated(); // TODO: Create a new Error type of `UserAlreadyExists`
                        }
                        console.log("[ERROR]: Postgres Error - ", error)

                        throw new UserNotCreated();
                }
        }

        static async verifyUser(username:string, pass:string):Promise<JWT_PAYLOAD>{
                const users = await psql<UserData[]>`SELECT * FROM Users WHERE username = ${username}`;
                if(users.length != 1){
                        throw new UserFindingError();
                }

                const user = users[0]
                if(Bun.password.verifySync(pass, (user?.hashpass==undefined?"":user?.hashpass))){
                        return {
                                username:user?.username,
                                userId:user?.id
                        } as JWT_PAYLOAD
                }
                else{
                        throw new UserPassWrong();
                }
        }

        static async initDB()
        {
            console.log("Creating database since didn't exist before.")
            const sqlCode: string = await Bun.file("./src/backend/database/SETUP.sql").text()

            console.log("Running SETUP.sql...");

            try {
                await psql.begin(async sql => {
                    const queries = sqlCode.split(';')
                        .map(s => s.trim())
                        .filter(s => s.length > 0);

                    for (const query of queries)
                    {
                        await sql.unsafe(query)
                    }

                    console.log("Done!")
                })
            } catch(error: any) {

                // Handle Connection Issues (Wrong password, DB offline, etc.)
                if (error.code === 'ECONNREFUSED' || error.message.includes('auth')) {
                    console.error("DATABASE CONNECTION FAILED:");
                    console.error("   Check the .env credentials and ensure Postgres is running.");
                } 
                // Handle SQL Syntax or Permission Issues
                else if (error.code?.startsWith('42')) {
                    console.error("SQL EXECUTION ERROR:");
                    console.error(`   Message: ${error.message}`);
                }
                else {
                    console.error('Failed to initialize database:', error);
                    throw error;
                }
            }
        }
}

export default Data;
