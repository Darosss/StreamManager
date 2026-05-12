import { Document } from "mongoose";
import z from "zod";
import { MessageCategorySchema, MessageCategoryUpdateSchema, MessageCategoryCreateSchema } from "./schemas";

export type MessageCategoryModel = z.infer<typeof MessageCategorySchema>;
export type MessageCategoryDocument = MessageCategoryModel & Document;
export type MessageCategoryUpdateData = z.infer<typeof MessageCategoryUpdateSchema>;
export type MessageCategoryCreateData = z.infer<typeof MessageCategoryCreateSchema>;
