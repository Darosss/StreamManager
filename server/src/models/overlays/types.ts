import { Document } from "mongoose";
import z from "zod";
import { OverlayCreateSchema, OverlaySchema, OverlayUpdateSchema } from "./schemas";

export type OverlayModel = z.infer<typeof OverlaySchema>;
export type OverlayDocument = OverlayModel & Document;
export type OverlayUpdateData = z.infer<typeof OverlayUpdateSchema>;
export type OverlayCreateData = z.infer<typeof OverlayCreateSchema>;
