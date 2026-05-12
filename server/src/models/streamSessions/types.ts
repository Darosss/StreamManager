import { Document } from "mongoose";
import z from "zod";
import {
  StreamSessionSchema,
  StreamSessionUpdateSchema,
  StreamSessionCreateSchema,
  SessionEventSchema
} from "./schemas";

export type SessionEventModel = z.infer<typeof SessionEventSchema>;

export type StreamSessionModel = z.infer<typeof StreamSessionSchema>;
export type StreamSessionDocument = StreamSessionModel & Document;
export type StreamSessionUpdateData = z.infer<typeof StreamSessionUpdateSchema>;
export type StreamSessionCreateData = z.infer<typeof StreamSessionCreateSchema>;
