import type z from "zod";
import type { userCreateZod } from "./zod_types";

export type userCreate = z.infer<typeof userCreateZod>
