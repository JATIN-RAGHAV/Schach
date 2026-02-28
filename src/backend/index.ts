import Elysia from 'elysia';
import router from './apis/apis';
import JWT from './helper/jwt';
import { Zobrist } from '../common/interfaces/Zobrist';
import cors from '@elysiajs/cors';

const PORT = 2222;
const App = new Elysia();

const initServer = () => {
    JWT.initKeys();
    App.listen(PORT, () => {
        console.log(
            `Server is listening at ${App.server?.hostname}:${App.server?.port}`,
        );
    });
    Zobrist.init();
};

App
    .use(cors())
    .use(router);
initServer();
