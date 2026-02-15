import Elysia from 'elysia';
import { access } from './access';
import { startGame } from './startGame';

const router = new Elysia();

router.use(access).use(startGame);

export default router;
