import { SongModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface SongsFindOptions {
  select?: SelectQuery<SongModel>;
  populate?: PopulateSelect;
}

export interface ManySongsFindOptions extends SongsFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type SongsOptionalData = Partial<Omit<SongModel, "_id" | "createdAt" | "updatedAt" | "whoAdded" | "enabled">>;

export type ManageSongLikesAction = "like" | "dislike" | "nothing";

export type CreateSongReturn = { isNew: boolean; song: SongModel };

export type UsesType = "botUses" | "songRequestUses";

export type ManageSongLikesByIds = { youtubeId: string } | { id: string };
