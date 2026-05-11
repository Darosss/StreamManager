import { MoodSchema } from "../moods/schemas";
import { TagSchema } from "../tags/schemas";
import z from "zod";

export const TimerSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1, "Timer name must be at least 1 length"),
  enabled: z.boolean(),
  delay: z.number(),
  points: z.number(),
  reqPoints: z.number(),
  nonFollowMulti: z.boolean(),
  nonSubMulti: z.boolean(),
  uses: z.number(),
  messages: z.array(z.string()),
  description: z.string(),
  mood: z.union([z.string(), MoodSchema]),
  tag: z.union([z.string(), TagSchema])
});

export const TimerUpdateSchema = TimerSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  tag: true,
  mood: true
})
  .extend({
    mood: z.string(),
    tag: z.string()
  })
  .partial();

export const TimerCreateSchema = TimerUpdateSchema.required({
  name: true,
  messages: true,
  mood: true,
  tag: true
});
