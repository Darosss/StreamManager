import z from "zod";

export const AffixSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1, "Affixes name must be at least 1 length"),
  enabled: z.boolean(),
  prefixes: z.array(z.string()),
  suffixes: z.array(z.string()),
  prefixChance: z.number(),
  suffixChance: z.number()
});

export const AffixUpdateSchema = AffixSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
}).partial();

export const AffixCreateSchema = AffixUpdateSchema.required({
  name: true
});
