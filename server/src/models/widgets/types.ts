import { Document } from "mongoose";
import z from "zod";
import { WidgetsSchema, WidgetsUpdateSchema, WidgetsCreateSchema } from "./schemas";

export type WidgetsModel = z.infer<typeof WidgetsSchema>;
export type WidgetsDocument = WidgetsModel & Document;
export type WidgetsUpdateData = z.infer<typeof WidgetsUpdateSchema>;
export type WidgetsCreateData = z.infer<typeof WidgetsCreateSchema>;
