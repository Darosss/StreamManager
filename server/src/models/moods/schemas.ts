import z from "zod";

export const MoodSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1, "Mood name must be at least 1 length"),
  enabled: z.boolean()
});

export const MoodUpdateSchema = MoodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
}).partial();

export const MoodCreateSchema = MoodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
}).partial({
  enabled: true
});
