import z from "zod";

export const userCreateZod = z.object({
    username: z
        .string()
        .min(3,"Must be at least 3 characters.")
        .max(32,"Must be at most 32 characters.")
        .regex(
            /^[a-zA-Z-_\d]+$/,
            "Only contains english characters and '-' and '_'.",
        ),
    password: z
        .string()
        .min(8)
        .max(32)
        .regex(/[a-z]+/, 'Must contain lower case characters')
        .regex(/[A-Z]+/, 'Must contain upper case characters')
        .regex(/[\d]+/, 'Must contain digits')
        .regex(/[@&#$!]+/, 'Must contain special characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&#$!]).+$/, 'Fix this'),
});

export type userCreate = z.infer<typeof userCreateZod>;
