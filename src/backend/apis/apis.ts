import Elysia from 'elysia';
import { access } from './access';
import { gameRun } from './gameStart';

const router = new Elysia();

router.use(access).use(gameRun);

export default router;
