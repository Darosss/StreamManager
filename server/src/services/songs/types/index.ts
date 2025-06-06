import { SongsModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface SongsFindOptions {
  select?: SelectQuery<SongsModel>;
  populate?: PopulateSelect;
}

export interface ManySongsFindOptions extends SongsFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type SongsOptionalData = Partial<Omit<SongsModel, "_id" | "createdAt" | "updatedAt" | "whoAdded" | "enabled">>;

export interface SongsCreateData
  extends Pick<SongsModel, "title" | "duration" | "youtubeId">,
    Omit<SongsOptionalData, "title" | "duration" | "whoAdded" | "youtubeId"> {
  whoAdded: string;
}

export interface SongsUpdateData
  extends SongsOptionalData,
    Partial<SongsCreateData>,
    Pick<SongsModel, "lastUsed">,
    Partial<Pick<SongsModel, "enabled">> {}

export type ManageSongLikesAction = "like" | "dislike" | "nothing";

export type CreateSongReturn = { isNew: boolean; song: SongsModel };

export type UsesType = "botUses" | "songRequestUses";

export type ManageSongLikesByIds = { youtubeId: string } | { id: string };
