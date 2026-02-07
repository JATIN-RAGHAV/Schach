import Elysia from "elysia";
import router from "./apis/apis";
const PORT = 2222;
const App = new Elysia()

App.use(router)

App.listen(PORT);
