import dayjs from "dayjs";
import { YoutubeApiHandler } from "../YoutubeAPIHandler";
import { getOneUser, createSong, getOneSong } from "@services";
import { botId, musicFolderName, ytMusicFolderName, ytMusicPath } from "@configs";
import { CommonSongHandlersReturnData, YoutubeSongProperties } from "./types";
import { convertSecondsToMS, musicLogger } from "@utils";
import { YoutubeSongInfoMessageType } from "./enums";
import { createWriteStream } from "fs";
import path from "path";
import fs from "fs";
import { createSabrStream, createStreamSink } from "./YoutubeDownloader";
import { SabrPlaybackOptions } from "googlevideo/sabr-stream";
import { EnabledTrackTypes } from "googlevideo/utils";
type SearchForYoutubeSongParams = {
  searchQuery?: string;
  youtubeId?: string;
};

(async () => {
  try {
    await fs.promises.mkdir(ytMusicPath, { recursive: true });
  } catch (err) {
    musicLogger.error(`Error creating directory ${ytMusicPath}: ${err}`);
  }
})();

class YoutubeMusic extends YoutubeApiHandler {
  private static readonly validateIdRegex = /^[a-zA-Z0-9-_]{11}$/;
  private readonly downloadOptions: SabrPlaybackOptions = {
    preferWebM: true,
    preferOpus: true,
    videoQuality: "480p",
    audioQuality: "AUDIO_QUALITY_MEDIUM",
    enabledTrackTypes: EnabledTrackTypes.AUDIO_ONLY
  };
  constructor() {
    super();
  }

  public static validateYtId(id: string) {
    return YoutubeMusic.validateIdRegex.test(id.trim());
  }

  public convertTopicDetailsIntoTags(topicDetails: YoutubeSongProperties["topicDetails"]) {
    const TOPIC_CATEGORY_SPLIT_FOR_TAG = "wiki/";
    const topicsNames = topicDetails?.topicCategories?.map((topic) => {
      const splitedTopic = topic.split(TOPIC_CATEGORY_SPLIT_FOR_TAG);
      return splitedTopic[splitedTopic.length - 1].toLowerCase();
    });

    return topicsNames?.join(", ") || "";
  }

  public async downloadSongAndUpdateDBData(
    { id, duration, name, topicDetails }: YoutubeSongProperties,
    usernameWhoAdded?: string
  ): Promise<CommonSongHandlersReturnData> {
    try {
      const { streamResults } = await createSabrStream(id, this.downloadOptions);
      const { audioStream } = streamResults;

      const outputPath = path.join(ytMusicPath, id + ".mp3");
      const audioOutputStream = createWriteStream(outputPath);
      await audioStream.pipeTo(createStreamSink(audioOutputStream));
    } catch (err) {
      console.error(err);
      return { error: "Download file failed, sorry" };
    }

    const addedByUser = await getOneUser({ $or: [{ username: usernameWhoAdded }, { twitchId: botId }] }, {});
    const createdSong = await createSong({
      duration: duration,
      whoAdded: String(addedByUser!._id),
      title: name,
      youtubeId: id,
      tags: this.convertTopicDetailsIntoTags(topicDetails),
      downloadedData: {
        publicPath: path.join(musicFolderName, ytMusicFolderName, id + ".mp3"),
        folderName: ytMusicFolderName,
        fileName: id + ".mp3"
      }
    });
    musicLogger.info(`downloadSongAndUpdateDBData -> new Song?: ${createdSong?.isNew}`);

    return createdSong!.song;
  }

  public async handleYoutubeSongLogic(
    searchParams: SearchForYoutubeSongParams,
    username?: string,
    maxSongDuration?: number
  ): Promise<CommonSongHandlersReturnData> {
    const videoDetails = await this.searchForYoutubeSong(searchParams);
    if (!videoDetails)
      return { error: this.findSongYoutubeMessageHandler(YoutubeSongInfoMessageType.NOT_FOUND, username) };
    else if (videoDetails.ageRestricted === "ytAgeRestricted") {
      return { error: this.findSongYoutubeMessageHandler(YoutubeSongInfoMessageType.AGE_RESTRICTED, username) };
    } else if (videoDetails.isPrivate) {
      return { error: this.findSongYoutubeMessageHandler(YoutubeSongInfoMessageType.PRIVATE, username) };
    }

    if (maxSongDuration && videoDetails && videoDetails.duration > maxSongDuration) {
      return { error: this.findSongYoutubeMessageHandler(YoutubeSongInfoMessageType.SONG_TOO_LONG, username) };
    }
    const foundSongInDb = await getOneSong({ youtubeId: videoDetails.id });
    if (!foundSongInDb) {
      return await this.downloadSongAndUpdateDBData(videoDetails, username);
    } else {
      return foundSongInDb;
    }
  }

  public async searchForYoutubeSong({
    searchQuery,
    youtubeId
  }: SearchForYoutubeSongParams): Promise<YoutubeSongProperties | undefined> {
    if (!searchQuery && !youtubeId) {
      musicLogger.error(`searchForYoutubeSong -> either youtubeId or searchQuery must be a string`);
      return;
    }
    const searchedItem = searchQuery
      ? await this.getYoutubeSearchVideosIds({
          q: searchQuery,
          maxResults: 1
        })
      : undefined;

    //Note: with condition above -> checking if searchQuery and youtubeId is undefined
    // we can assume that either searchedItem or youtubeId is defined.
    const ids = searchedItem ? searchedItem! : [youtubeId!];

    const videoDetails = await this.getYoutubeVideosDetailsById(ids);

    if (videoDetails) return videoDetails[0];
  }

  public async getYoutubeVideosDetailsById(ids: string[]): Promise<YoutubeSongProperties[] | undefined> {
    const videoDetails = await this.getYoutubeVideosById(ids, ["snippet", "status", "contentDetails", "topicDetails"]);

    if (!videoDetails) return;
    const foundedVideos = videoDetails?.map<YoutubeSongProperties>((item) => {
      return {
        id: item.id || "",
        name: item.snippet?.title || "",
        duration: dayjs.duration(Number(item.contentDetails?.duration || 0)).seconds(),
        ageRestricted: item.contentDetails?.contentRating?.ytRating,
        isPrivate: item.status?.privacyStatus === "private",
        topicDetails: item.topicDetails,
        type: "yt"
      };
    });

    // in case where id and name === "" filter;
    const filteredVideos = foundedVideos?.filter((item) => {
      if (item.id.length > 0 && item.name.length > 0) return true;
    });
    return filteredVideos;
  }

  private findSongYoutubeMessageHandler(
    messageType: YoutubeSongInfoMessageType,
    username?: string,
    maxSongDuration?: number
  ) {
    let message = username ? `@${username}, ` : "";

    switch (messageType) {
      case YoutubeSongInfoMessageType.SONG_TOO_LONG:
        message += `${YoutubeSongInfoMessageType.SONG_TOO_LONG}. ${
          maxSongDuration ? `It exceeds ${convertSecondsToMS(maxSongDuration)}` : ""
        } minutes`;
        break;
      case YoutubeSongInfoMessageType.AGE_RESTRICTED:
        message += `${YoutubeSongInfoMessageType.AGE_RESTRICTED}`;
        break;
      case YoutubeSongInfoMessageType.NOT_FOUND:
      default:
        message += `${YoutubeSongInfoMessageType.NOT_FOUND}`;
        break;
    }

    return message;
  }
}

const youtubeMusic = new YoutubeMusic();
export { YoutubeMusic };
export default youtubeMusic;
