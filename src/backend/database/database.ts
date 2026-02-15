import postgres from 'postgres';
import {
    UserFindingError,
    UserNotCreated,
    UserNotFound,
    UserPassWrong,
} from '../helper/errors';
import type { JWT_PAYLOAD } from '../interfaces/jwt_payload';
import type { UserData } from './interfaces';

const database_url = Bun.env.DATABASE_URL;
const host = Bun.env.HOST;
const port: number = +(Bun.env.PORT ? Bun.env.PORT : 5432);
const database = Bun.env.DATABASE;
const username = Bun.env.USERNAME;
const password = Bun.env.PASSWORD;
const psql = postgres(database_url ? database_url : '', {
    host,
    port,
    database,
    username,
    password,
});

type Constructor<T extends object = object> =
    // eslint-disable-next-line
    new (...args: any[]) => T;
const Database = <Tbase extends Constructor>(Base: Tbase) =>
    class extends Base {
        static async getUser(username: string): Promise<UserData> {
            try {
                const users = await psql<
                    UserData[]
                >`SELECT * FROM Users WHERE username = ${username}`;
                if (users[0] == undefined) {
                    throw new UserNotFound();
                }

                return users[0];
            } catch {
                throw new UserNotFound();
            }
        }

        static async createUser(
            username: string,
            pass: string,
        ): Promise<JWT_PAYLOAD> {
            const hashPass: string = Bun.password.hashSync(pass);
            try {
                await psql<
                    UserData[]
                >`INSERT INTO Users (username,hashPass) VALUES(${username},${hashPass})`;

                const user = await this.getUser(username);
                if (!(user instanceof Error)) {
                    return {
                        username: user.username,
                        userId: user.id,
                    };
                }
                throw new UserNotCreated();
            } catch {
                throw new UserNotCreated();
            }
        }

        static async verifyUser(
            username: string,
            pass: string,
        ): Promise<JWT_PAYLOAD> {
            const users = await psql<
                UserData[]
            >`SELECT * FROM Users WHERE username = ${username}`;
            if (users.length != 1) {
                throw new UserFindingError();
            }

            const user = users[0];
            if (
                Bun.password.verifySync(
                    pass,
                    user?.hashpass == undefined ? '' : user?.hashpass,
                )
            ) {
                return {
                    username: user?.username,
                    userId: user?.id,
                } as JWT_PAYLOAD;
            } else {
                throw new UserPassWrong();
            }
        }
    };

export default Database;
