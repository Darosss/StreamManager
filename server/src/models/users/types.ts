import z from "zod";
import { Document } from "mongoose";
import { BadgeModel } from "../badges";
import { createUserSchema, UserCreateSchema, UserUpdateSchema } from "./schemas";
import { BadgeSchema } from "models/badges/schemas";

export type UserDisplayBadgesType<BadgeType extends string | BadgeModel = string> = [BadgeType, BadgeType, BadgeType];

export type UserDocument = UserModel & Document;
export type UserModel<BadgeType = string | z.infer<typeof BadgeSchema>> = z.infer<
  ReturnType<typeof createUserSchema<z.ZodType<BadgeType>>>
>;

export type UserCreateData = z.infer<typeof UserCreateSchema>;

export type UserUpdateData = z.infer<typeof UserUpdateSchema>;
