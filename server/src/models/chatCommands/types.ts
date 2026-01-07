import { Document } from "mongoose";
import { ChatCommandCreateSchema, ChatCommandSchema, ChatCommandUpdateSchema } from "./schemas";
import z from "zod";

export type ChatCommandModel = z.infer<typeof ChatCommandSchema>;
export type ChatCommandDocument = ChatCommandModel & Document;

export type ChatCommandCreateData = z.infer<typeof ChatCommandCreateSchema>;

export type ChatCommandUpdateData = z.infer<typeof ChatCommandUpdateSchema>;
