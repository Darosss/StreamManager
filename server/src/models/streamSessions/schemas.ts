import { UserSchemaWithBadgeModel, UserSchemaWithStringBadges } from "../users/schemas";
import z from "zod";

export const SessionEventSchema = z.object({
  user: z.union([z.string(), UserSchemaWithBadgeModel, UserSchemaWithStringBadges]),
  name: z.string()
});

export const StreamSessionSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sessionStart: z.date(),
  sessionEnd: z.date(),
  sessionTitles: z.record(z.string(), z.string()),
  categories: z.record(z.string(), z.string()),
  tags: z.record(z.string(), z.string()),
  viewers: z.record(z.string(), z.number()),
  watchers: z.record(z.string(), z.number()),
  events: z.array(SessionEventSchema)
});

const StreamSessionOptionalSchema = StreamSessionSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
})
  .extend({})
  .partial();

export const StreamSessionUpdateSchema = StreamSessionOptionalSchema.omit({ sessionStart: true }).partial();
export const StreamSessionCreateSchema = StreamSessionOptionalSchema.required({ sessionStart: true });
