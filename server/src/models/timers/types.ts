import { Document } from "mongoose";
import z from "zod";
import { TimerCreateSchema, TimerSchema, TimerUpdateSchema } from "./schemas";

export type TimerModel = z.infer<typeof TimerSchema>;
export type TimerDocument = TimerModel & Document;
export type TimerUpdateData = z.infer<typeof TimerUpdateSchema>;
export type TimerCreateData = z.infer<typeof TimerCreateSchema>;
