import { Document } from "mongoose";
import { TagCreateSchema, TagSchema, TagUpdateSchema } from "./schemas";
import z from "zod";

export type TagModel = z.infer<typeof TagSchema>;
export type TagDocument = TagModel & Document;
export type TagUpdateData = z.infer<typeof TagUpdateSchema>;
export type TagCreateData = z.infer<typeof TagCreateSchema>;
