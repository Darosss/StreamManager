import { Document } from "mongoose";
import z from "zod";
import { MessageCreateSchema, MessageSchema, MessageUpdateSchema } from "./schemas";

export type MessageModel = z.infer<typeof MessageSchema>;
export type MessageDocument = MessageModel & Document;
export type MessageUpdateData = z.infer<typeof MessageUpdateSchema>;
export type MessageCreateData = z.infer<typeof MessageCreateSchema>;
