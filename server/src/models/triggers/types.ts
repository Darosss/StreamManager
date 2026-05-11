import { Document } from "mongoose";
import z from "zod";
import { TriggerCreateSchema, TriggerModeSchema, TriggerSchema, TriggerUpdateSchema } from "./schemas";

export type TriggerMode = z.infer<typeof TriggerModeSchema>;
export type TriggerModel = z.infer<typeof TriggerSchema>;
export type TriggerDocument = TriggerModel & Document;
export type TriggerUpdateData = z.infer<typeof TriggerUpdateSchema>;
export type TriggerCreateData = z.infer<typeof TriggerCreateSchema>;
