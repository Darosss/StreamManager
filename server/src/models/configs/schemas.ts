import { minDelayTimer } from "@configs";
import z from "zod";

export const CommandsConfigsSchema = z.object({
  commandsPrefix: z.string().min(1)
});
export const TimersConfigsSchema = z.object({
  timersIntervalDelay: z.number().min(minDelayTimer, `Timers interval must be at least ${minDelayTimer}`),
  nonFollowTimerPoints: z.number().min(0),
  nonSubTimerPoints: z.number().min(0),
  suffixChance: z.number().min(0),
  prefixChance: z.number().min(0)
});

export const TriggersConfigsSchema = z.object({
  randomMessageChance: z.number().min(0),
  suffixChance: z.number().min(0),
  prefixChance: z.number().min(0)
});

export const PointsIncrementSchema = z.object({
  message: z.number().min(1),
  watch: z.number().min(1),
  watchMultipler: z.number().min(1)
});
export const PointsConfigsSchema = z.object({
  pointsIncrement: PointsIncrementSchema
});

export const LoyaltyConfigsSchema = z.object({
  intervalCheckChatters: z.number().min(5000, "Check chatters interval must be at least 5000")
});
export const ChatGamesConfigsSchema = z.object({
  activeUserTimeDelay: z.number().min(5000, "Check active users interval must be at least 5000"),
  chatGamesIntervalDelay: z.number().min(5000, "Check chat games interval must be at least 5000"),
  minActiveUsersThreshold: z.number().min(1)
});

export const MusicConfigsSchema = z.object({
  songRequest: z.boolean(),
  maxAutoQueSize: z.number().min(1),
  maxSongRequestByUser: z.number().min(1)
});

export const PermissionLevelsSchema = z
  .object({
    broadcaster: z.number().min(0),
    mod: z.number().min(1, "Min permission for mod is 1"),
    vip: z.number().min(2, "Min permission for vip is 2"),
    all: z.number().min(3, "Min permission for all is 3")
  })
  .refine((data) => data.broadcaster > data.mod && data.mod > data.vip && data.vip > data.all, {
    message: "Permission levels must be in descending order: broadcaster > mod > vip > all"
  });
export const DelayBetweenMessagesSchema = z
  .object({
    min: z.number().min(5000),
    max: z.number().min(5000)
  })
  .refine((data) => data.max >= data.min, {
    message: "Max delay must be greater than or equal to min delay",
    path: ["max"]
  });

export const AchievementsConfigsSchema = z.object({
  obtainedAchievementsChannelId: z.string()
});
export const HeadConfigsSchema = z.object({
  permissionLevels: PermissionLevelsSchema,
  intervalCheckViewersPeek: z.number().min(5000, "Check viewers peek interval must be at least 5000"),
  delayBetweenMessages: DelayBetweenMessagesSchema
});

export const ConfigSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  commandsConfigs: CommandsConfigsSchema,
  timersConfigs: TimersConfigsSchema,
  triggersConfigs: TriggersConfigsSchema,
  pointsConfigs: PointsConfigsSchema,
  loyaltyConfigs: LoyaltyConfigsSchema,
  chatGamesConfigs: ChatGamesConfigsSchema,
  musicConfigs: MusicConfigsSchema,
  achievementsConfigs: AchievementsConfigsSchema,
  headConfigs: HeadConfigsSchema
});

export const ConfigUpdateDataSchema = z
  .object({
    commandsConfigs: CommandsConfigsSchema.partial(),
    timersConfigs: TimersConfigsSchema.partial(),
    triggersConfigs: TriggersConfigsSchema.partial(),
    pointsConfigs: PointsConfigsSchema.partial(),
    loyaltyConfigs: LoyaltyConfigsSchema.partial(),
    chatGamesConfigs: ChatGamesConfigsSchema.partial(),
    musicConfigs: MusicConfigsSchema.partial(),
    achievementsConfigs: AchievementsConfigsSchema.partial(),
    headConfigs: HeadConfigsSchema.partial()
  })
  .partial();
