import Elysia from "elysia";
import router from "./apis/apis";
import { log } from "./helper/jwt";
const PORT = 2222;
const App = new Elysia()

App.use(router)
log()

App.listen(PORT);
