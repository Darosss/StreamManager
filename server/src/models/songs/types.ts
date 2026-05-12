import { Document } from "mongoose";
import { CustomTitleSchema, DownloadedDataSchema, SongCreateSchema, SongSchema, SongUpdateSchema } from "./schemas";
import z from "zod";

export type CustomTitle = z.infer<typeof CustomTitleSchema>;
export type DownloadedData = z.infer<typeof DownloadedDataSchema>;

export type SongModel = z.infer<typeof SongSchema>;
export type SongDocument = SongModel & Document;
export type SongUpdateData = z.infer<typeof SongUpdateSchema>;
export type SongCreateData = z.infer<typeof SongCreateSchema>;
