import { UserSchemaWithBadgeModel, UserSchemaWithStringBadges } from "../users/schemas";
import z from "zod";

export const MessageSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  message: z.string().min(1, "Message must be at least 1 length"),
  date: z.date(),
  owner: z.union([z.string(), UserSchemaWithBadgeModel, UserSchemaWithStringBadges]),
  ownerUsername: z.string()
});

export const MessageUpdateSchema = MessageSchema.omit({ _id: true, createdAt: true, updatedAt: true, owner: true })
  .partial()
  .extend({
    owner: z.string()
  });
export const MessageCreateSchema = MessageUpdateSchema.required({
  message: true,
  date: true,
  owner: true,
  ownerUsername: true
});
