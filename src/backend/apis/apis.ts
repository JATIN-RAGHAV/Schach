import Elysia from 'elysia';
import { access } from './access';
import { gameRun } from './gameStart';
import { userData } from './userInfo';
import { anonymouseGameRun } from './anonymousGameStart';

// Paths which require authrization
const noAuthPaths = new Elysia()
.use(access);

// Paths which use tokens in the headers
const authPaths = new Elysia().use(userData).use(gameRun)

const router = new Elysia().use(noAuthPaths).use(authPaths).use(anonymouseGameRun)
export default router;
