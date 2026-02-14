import z from "zod";

export const createGameZod = z.object({
        color:z.coerce.number(),
        time:z.coerce.number(),
        increment:z.coerce.number()
});
