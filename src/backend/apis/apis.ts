import Elysia from "elysia";
import { access } from "./access";
import { startGame } from "./startGame";

let router = new Elysia();

router.use(access)
        .use(startGame)

export default router
