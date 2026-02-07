import Elysia from "elysia";
import { access } from "./access";

let router = new Elysia();

router.use(access)

export default router
