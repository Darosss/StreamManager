import z from "zod";
import { Document } from "mongoose";
import { BadgeSchema, BadgeCreateSchema, BadgeUpdateSchema, BadgeImagesUrlsSchema } from "./schemas";

export type BadgeModelImagesUrls = z.infer<typeof BadgeImagesUrlsSchema>;

export type BadgeModel = z.infer<typeof BadgeSchema>;
export type BadgeDocument = BadgeModel & Document;

export type BadgeCreateData = z.infer<typeof BadgeCreateSchema>;

export type BadgeUpdateData = z.infer<typeof BadgeUpdateSchema>;
