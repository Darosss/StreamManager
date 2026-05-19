import { checkExistResource, AppError, handleAppError, logger } from "@utils";
import { ProjectionType, QueryFilter, UpdateQuery } from "mongoose";
import {
  CreateSongReturn,
  ManageSongLikesAction,
  ManageSongLikesByIds,
  ManySongsFindOptions,
  SongsFindOptions,
  UsesType
} from "./types";
import { SongCreateData, SongDocument, Songs, SongUpdateData } from "@models";
import { getUserById } from "@services";

export const getSongs = async (filter: QueryFilter<SongDocument> = {}, findOptions: ManySongsFindOptions) => {
  const { limit = 50, skip = 1, sort = { createdAt: 1 }, select = { __v: 0 }, populate = [] } = findOptions;

  try {
    const songs = await Songs.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .populate(populate)
      .sort(sort);

    return songs;
  } catch (err) {
    logger.error(`Error occured while getting songs. ${err}`);
    handleAppError(err);
  }
};

export const getSongsCount = async (filter: QueryFilter<SongDocument> = {}) => {
  return await Songs.countDocuments(filter);
};

const handleExistingSongCreate = async (createData: SongCreateData): Promise<CreateSongReturn | undefined> => {
  const filterData = [];

  if (createData.sunoId) {
    filterData.push({ sunoId: createData.sunoId });
  }

  if (createData.youtubeId) {
    filterData.push({ youtubeId: createData.youtubeId });
  }

  const foundSong = await getOneSong(
    {
      $and: [
        ...filterData,
        ...(filterData.length == 0 && createData.downloadedData?.fileName
          ? [{ "downloadedData.fileName": createData.downloadedData.fileName }]
          : [])
      ]
      //TODO: add here to check if exisist as local
    },
    {}
  );

  if (foundSong) {
    const updatedSong = await updateSongById(foundSong._id.toString(), createData);
    return { isNew: false, song: updatedSong! };
  }
};

export const createSong = async (createData: SongCreateData): Promise<CreateSongReturn | undefined> => {
  const { sunoId, youtubeId, downloadedData, whoAdded, ...rest } = createData;

  const existingSongData = await handleExistingSongCreate(createData);
  if (existingSongData) return existingSongData;

  try {
    checkExistResource(await getUserById(whoAdded, { select: { _id: true } }), "Creator of song");

    const modifiedCreateData = {
      ...rest,
      whoAdded: whoAdded,
      ...(sunoId ? { sunoId: sunoId } : {}),
      ...(youtubeId == "youtube" ? { youtubeId: youtubeId } : {}),
      ...(!sunoId && !youtubeId && downloadedData ? { downloadedData } : {})
    };

    const createdSong = await Songs.create(modifiedCreateData);

    if (!createdSong) {
      throw new AppError(400, "Couldn't create new song(s");
    }
    return { isNew: true, song: createdSong };
  } catch (err) {
    logger.error(`Error occured while creating song(s). ${err}`);
    handleAppError(err);
  }
};

export const updateSongs = async (filter: QueryFilter<SongDocument> = {}, updateData: UpdateQuery<SongUpdateData>) => {
  try {
    await Songs.updateMany(filter, updateData);
  } catch (err) {
    logger.error(`Error occured while updating many songs. ${err}`);
    handleAppError(err);
  }
};

export const updateSongById = async (id: string, updateData: UpdateQuery<SongUpdateData>) => {
  try {
    const updatedSong = await Songs.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const songs = checkExistResource(updatedSong, `Song with id(${id})`);

    return songs;
  } catch (err) {
    logger.error(`Error occured while editing song by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const manageSongLikesById = async (
  idData: ManageSongLikesByIds,
  action: ManageSongLikesAction,
  userId: string
) => {
  const filter: QueryFilter<SongDocument> =
    "id" in idData
      ? { _id: idData.id }
      : {
          youtubeId: idData.youtubeId
        };
  const songID = filter._id || filter.youtubeId;
  try {
    const updatedSong = await Songs.findOneAndUpdate(
      filter,
      { $set: { [`likes.${userId}`]: action === "like" ? 1 : action === "dislike" ? -1 : 0 } },
      { new: true }
    );

    const songs = checkExistResource(updatedSong, `Song with id(${songID})`);

    return songs;
  } catch (err) {
    logger.error(`Error occured while editing song by youtubeId(${songID}). ${err}`);
    handleAppError(err);
  }
};

export const deleteSongById = async (id: string) => {
  try {
    const deletedSong = await Songs.findByIdAndDelete(id);

    const songs = checkExistResource(deletedSong, `Song with id(${id})`);

    return songs;
  } catch (err) {
    logger.error(`Error occured while deleting song by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getSongById = async (id: string, projection: ProjectionType<SongDocument> = {}) => {
  try {
    const foundSong = await Songs.findById(id, projection);

    const songs = checkExistResource(foundSong, `Song with id(${id})`);

    return songs;
  } catch (err) {
    logger.error(`Error occured while getting song: ${err}`);
    handleAppError(err);
  }
};

export const getOneSong = async (filter: QueryFilter<SongDocument> = {}, findOptions?: SongsFindOptions) => {
  const { populate = [], select = { __v: 0 } } = findOptions || {};
  try {
    const foundSong = await Songs.findOne(filter).select(select).populate(populate);

    return foundSong;
  } catch (err) {
    logger.error(`Error occured while getting songs: ${err}`);
    handleAppError(err);
  }
};
export const updateSongUsesById = async (id: string, useType: UsesType) => {
  const incrementData = {
    botUses: useType === "botUses" ? 1 : 0,
    songRequestUses: useType === "songRequestUses" ? 1 : 0,
    uses: 1
  };
  try {
    const updatedSong = await Songs.findByIdAndUpdate(id, { $inc: incrementData }, { new: true });

    const song = checkExistResource(updatedSong, `Song with id(${id})`);

    return song;
  } catch (err) {
    logger.error(`Error occured while editing song by id(${id}). ${err}`);
    handleAppError(err);
  }
};
