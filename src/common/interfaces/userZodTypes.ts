import z from "zod";

export const userCreateZod = z.object({
        username: z.string().min(3).max(32).regex(/^[a-zA-Z-_\d]+$/,"Only contains english characters and '-' and '_'."),
        pass: z.string().min(8).max(32)
        .regex(/[a-z]+/,"Must contain lower case characters")
        .regex(/[A-Z]+/,"Must contain upper case characters")
        .regex(/[\d]+/,"Must contain digits")
        .regex(/[@&#$!]+/,"Must contain special characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&#$!]).+$/,"Fix this")
});
