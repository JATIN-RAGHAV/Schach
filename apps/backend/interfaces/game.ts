import { gameCreateZod } from '@schach/common/interfaces/gameZodTypes';
import z from 'zod';

export type gameCreate = z.infer<typeof gameCreateZod>;
