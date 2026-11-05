import { zObjectId } from "../../utils/schemas";
import { MoodSchema } from "../moods/schemas";
import { TagSchema } from "../tags/schemas";
import z from "zod";

export const TriggerModeSchema = z.enum(["WholeWord", "StartsWith", "All"]);
export const TriggerSchema = z.object({
  _id: zObjectId(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1, "Trigger name must be at least 1 length"),
  enabled: z.boolean(),
  chance: z.number(),
  delay: z.number(),
  onDelay: z.boolean(),
  uses: z.number(),
  words: z.array(z.string()),
  messages: z.array(z.string()),
  mode: TriggerModeSchema,
  mood: z.union([zObjectId(), MoodSchema]),
  tag: z.union([zObjectId(), TagSchema])
});

export const TriggerUpdateSchema = TriggerSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  tag: true,
  mood: true
})
  .extend({
    mood: zObjectId(),
    tag: zObjectId()
  })
  .partial();

export const TriggerCreateSchema = TriggerUpdateSchema.required({
  name: true,
  words: true,
  messages: true,
  mood: true,
  tag: true
});
