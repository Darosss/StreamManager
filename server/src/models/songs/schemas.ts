import { UserSchemaWithBadgeModel, UserSchemaWithStringBadges } from "models/users/schemas";
import z from "zod";

export const DownloadedDataSchema = z.object({
  fileName: z.string(),
  folderName: z.string(),
  publicPath: z.string()
});
export const CustomTitleSchema = z.object({
  band: z.string(),
  title: z.string()
});

export const SongSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string().min(1, "Song title must be at least 1 length"),
  youtubeId: z.string().optional(),
  sunoId: z.string().optional(),
  localSong: z.boolean().optional(),
  downloadedData: DownloadedDataSchema.optional(),
  customTitle: CustomTitleSchema,
  customId: z.string().optional(),
  duration: z.number().min(0),
  uses: z.number().min(0),
  usersUses: z.record(z.string(), z.number()),
  botUses: z.number().min(0),
  songRequestUses: z.number().min(0),
  whoAdded: z.union([z.string(), UserSchemaWithStringBadges, UserSchemaWithBadgeModel]),
  likes: z.record(z.string(), z.number()),
  enabled: z.boolean(),
  lastUsed: z.date().optional(),
  tags: z.string()
});

export const SongUpdateSchema = SongSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  whoAdded: true
})
  .extend({
    whoAdded: z.string()
  })
  .partial();

export const SongCreateSchema = SongUpdateSchema.omit({}).required({
  title: true,
  duration: true,
  whoAdded: true
});
