import z from "zod";
import { MoodSchema } from "../moods";
import { TagSchema } from "../tags";
import { zObjectId } from "../../utils/schemas";

export const MessageCategorySchema = z.object({
  _id: zObjectId(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1, "Category name must be at least 1 length"),
  messages: z.array(z.tuple([z.string(), z.number()])),
  enabled: z.boolean(),
  uses: z.number(),
  mood: z.union([zObjectId(), MoodSchema]),
  tag: z.union([zObjectId(), TagSchema])
});

export const MessageCategoryUpdateSchema = MessageCategorySchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  messages: true
})
  .partial()
  .extend({
    tag: zObjectId(),
    mood: zObjectId(),
    messages: z.array(z.string())
  });
export const MessageCategoryCreateSchema = MessageCategoryUpdateSchema.required({
  name: true,
  messages: true
});
