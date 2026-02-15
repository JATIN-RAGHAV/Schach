import Elysia from 'elysia';
import router from './apis/apis';
import JWT from './helper/jwt';
const PORT = 2222;
const App = new Elysia();

const initServer = () => {
    JWT.initKeys();
    App.listen(PORT, () => {
        console.log(
            `Server is listening at ${App.server?.hostname}:${App.server?.port}`,
        );
    });
};

App.use(router);
initServer();
