import z from 'zod';

export const gameCreateZod = z.object({
    color: z.coerce.number(),
    time: z.coerce.number(),
    increment: z.coerce.number(),
});
