import { BadgeModel } from "../badges";
import { BadgeSchema } from "../badges/schemas";

import z from "zod";

export const createDisplayBadgesSchema = <T extends z.ZodTypeAny>(badgeSchema: T) =>
  z.tuple([badgeSchema, badgeSchema, badgeSchema]);

// Generic function that creates the user schema
export const createUserSchema = <T extends z.ZodTypeAny>(badgeSchema: T) =>
  z.object({
    _id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    twitchId: z.string(),
    username: z.string(),
    privileges: z.number().min(0).max(10).default(0),
    points: z.number().default(0),
    watchTime: z.number().default(0),
    lastSeen: z.date(),
    messageCount: z.number().default(0),
    notes: z.array(z.string()).optional(),
    twitchName: z.string().optional(),
    twitchCreated: z.date().optional(),
    follower: z.date().optional(),
    displayBadges: createDisplayBadgesSchema(badgeSchema).optional()
  });

export const UserSchemaWithStringBadges = createUserSchema(z.string());
export const UserSchemaWithBadgeModel = createUserSchema(BadgeSchema);

export const UserCreateSchema = UserSchemaWithStringBadges.pick({
  username: true,
  twitchName: true,
  twitchId: true
});

export const UserUpdateSchema = UserSchemaWithStringBadges.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
}).partial();
