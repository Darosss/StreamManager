import z from "zod";
import { MoodSchema } from "@models";
import { TagSchema } from "@models";

export const ChatCommandSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1),
  description: z.string().optional(),
  enabled: z.boolean().default(true).optional(),
  uses: z.number(),
  messages: z.array(z.string()),
  tag: z.union([z.string(), TagSchema]),
  mood: z.union([z.string(), MoodSchema]),
  aliases: z.array(z.string()),
  privilege: z.number().min(0).max(10)
});

export const ChatCommandCreateSchema = ChatCommandSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  privilege: true,
  tag: true,
  mood: true,
  uses: true
}).extend({
  tag: z.string(),
  mood: z.string(),
  privilege: z.number().min(0).max(10).optional()
});

export const ChatCommandUpdateSchema = ChatCommandCreateSchema.partial().extend({
  uses: z.number().optional()
});
