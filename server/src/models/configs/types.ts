import z from "zod";
import { ConfigSchema, ConfigUpdateDataSchema } from "./schemas";

export type ConfigModel = z.infer<typeof ConfigSchema>;
export type ConfigDocument = ConfigModel & Document;
export type ConfigUpdateData = z.infer<typeof ConfigUpdateDataSchema>;
