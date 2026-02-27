import z from 'zod';
import { color } from './enums';

export const gameCreateZod = z.object({
    color: z.enum([color.Black, color.White, color.Random]),
    time: z.coerce.number(),
    increment: z.coerce.number(),
});
