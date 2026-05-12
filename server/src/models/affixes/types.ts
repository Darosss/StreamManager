import z from "zod";
import { Document } from "mongoose";
import { AffixSchema, AffixUpdateSchema, AffixCreateSchema } from "./schemas";

export type AffixModel = z.infer<typeof AffixSchema>;
export type AffixDocument = AffixModel & Document;
export type AffixUpdateData = z.infer<typeof AffixUpdateSchema>;
export type AffixCreateData = z.infer<typeof AffixCreateSchema>;
