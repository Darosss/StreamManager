import z from "zod";
import { zObjectId } from "../../utils/schemas";

export const TagSchema = z.object({
  _id: zObjectId(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1, "Tag name must be at least 1 length"),
  enabled: z.boolean()
});

export const TagUpdateSchema = TagSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
}).partial();

export const TagCreateSchema = TagSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
}).partial({
  enabled: true
});
