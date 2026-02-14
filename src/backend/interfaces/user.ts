import type z from "zod";
import { userCreateZod } from "../../common/interfaces/userZodTypes";

export type userCreate = z.infer<typeof userCreateZod>
