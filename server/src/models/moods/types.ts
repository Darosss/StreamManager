import { Document } from "mongoose";
import { MoodCreateSchema, MoodSchema, MoodUpdateSchema } from "./schemas";
import z from "zod";

export type MoodModel = z.infer<typeof MoodSchema>;
export type MoodDocument = MoodModel & Document;
export type MoodUpdateData = z.infer<typeof MoodUpdateSchema>;
export type MoodCreateData = z.infer<typeof MoodCreateSchema>;
