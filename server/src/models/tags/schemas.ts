import z from "zod";

export const TagSchema = z.object({
  _id: z.string(),
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
