import Elysia from 'elysia';
import Data from '../database/data';
import JWT from '../helper/jwt';
import { userCreateZod } from '../../common/interfaces/userZodTypes';

export const access = new Elysia({ prefix: '/user' });

access.post('/create', async ({ body }) => {
    const res = userCreateZod.safeParse(body);
    if (!res.success) {
        return {
            error: true,
            message: [...JSON.parse(res.error.message)],
        };
    }
    try {
        const { username, pass } = res.data;
        const payload = await Data.createUser(username, pass);
        const token = await JWT.sign(payload);
        console.log(``);
        return {
            error: false,
            token: token,
        };
    } catch (e) {
        return {
            error: true,
            message: e,
        };
    }
});

access.post('/login', async ({ body }) => {
    const res = userCreateZod.safeParse(body);
    if (!res.success) {
        return {
            error: true,
            message: [...JSON.parse(res.error.message)],
        };
    }
    try {
        const { username, pass } = res.data;
        const payload = await Data.verifyUser(username, pass);
        const token = await JWT.sign(payload);
        return {
            error: false,
            token: token,
        };
    } catch (e) {
        return {
            error: true,
            message: e,
        };
    }
});
