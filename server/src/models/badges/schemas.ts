import z from "zod";

export const BadgeImagesUrlsSchema = z.object({
  x32: z.string(),
  x64: z.string(),
  x96: z.string(),
  x128: z.string()
});

export const BadgeSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1),
  description: z.string().optional(),
  imagesUrls: BadgeImagesUrlsSchema
});

export const BadgeCreateSchema = BadgeSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
});

export const BadgeUpdateSchema = BadgeCreateSchema.partial().extend({
  uses: z.number().optional()
});
