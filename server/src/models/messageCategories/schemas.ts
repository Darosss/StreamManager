import z from "zod";
import { MoodSchema } from "../moods";
import { TagSchema } from "../tags";

export const MessageCategorySchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1, "Category name must be at least 1 length"),
  messages: z.array(z.tuple([z.string(), z.number()])),
  enabled: z.boolean(),
  uses: z.number(),
  mood: z.union([z.string(), MoodSchema]),
  tag: z.union([z.string(), TagSchema])
});

export const MessageCategoryUpdateSchema = MessageCategorySchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  messages: true
})
  .partial()
  .extend({
    tag: z.string(),
    mood: z.string(),
    messages: z.array(z.string())
  });
export const MessageCategoryCreateSchema = MessageCategoryUpdateSchema.required({
  name: true,
  messages: true
});
