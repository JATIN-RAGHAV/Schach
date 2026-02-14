import { createGameZod } from "../../common/interfaces/gameZodTypes";
import z from "zod";

export type createGame = z.infer<typeof createGameZod>;
