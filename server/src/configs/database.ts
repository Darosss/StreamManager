import {
  configExist,
  createNewConfig,
  createChatCommand,
  getChatCommandsCount,
  createTag,
  getOneTag,
  getTagsCount,
  createMood,
  getMoodsCount,
  getOneMood,
  getAchievementsCount,
  createBadge,
  getAchievementStagesCount,
  createAchievementStage,
  createAchievement
} from "@services";
import mongoose from "mongoose";
import {
  getDefaultAchievementStagesData,
  getDefaultAchievementsData,
  getDefaultBadgeData,
  getDefaultChatCommands,
  getDefaultMood,
  getDefaultTag
} from "@defaults";
import { databaseConnectURL } from "./envVariables";

export const initMongoDataBase = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(databaseConnectURL);
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }

  await createDefaultConfigs();

  await Promise.all([createDefaultTag(), createDefaultMood()]);

  await createDefaultCommands();
  await createDefaultInitialAchievements();
};

const createDefaultConfigs = async () => {
  if (!(await configExist())) await createNewConfig();
};

const createDefaultCommands = async () => {
  if ((await getChatCommandsCount()) === 0) {
    const modes = await Promise.all([getOneTag({}), getOneMood({})]);

    const [tag, mood] = modes;
    if (tag && mood) {
      const chatCommands = getDefaultChatCommands();
      const chatCommandsWithModes = chatCommands.map((command) => {
        return {
          ...command,
          tag: tag.id,
          mood: mood.id
        };
      });
      await createChatCommand(chatCommandsWithModes);
    }
  }
};
const createDefaultTag = async () => {
  if ((await getTagsCount()) === 0) {
    const tags = getDefaultTag();
    await createTag(tags);
  }
};

const createDefaultMood = async () => {
  if ((await getMoodsCount()) === 0) {
    const moods = getDefaultMood();
    await createMood(moods);
  }
};

const createDefaultAchievementStages = async (badgeId: string) => {
  if ((await getAchievementStagesCount()) === 0) {
    return await createAchievementStage(getDefaultAchievementStagesData(badgeId));
  }
};

const createDefaultAchievements = async (stagesId: string, tagId: string) => {
  const achievementsData = getDefaultAchievementsData(stagesId, tagId);

  achievementsData.forEach((data) => createAchievement(data));
};

const createDefaultInitialAchievements = async () => {
  if ((await getAchievementsCount()) !== 0) return;
  const foundTag = await getOneTag({});
  if (!foundTag) throw new Error("Error while creating default initial achievements -> No tag found");
  const badge = await createBadge(getDefaultBadgeData());
  if (!badge) throw new Error("Error while creating default initial achievements -> No created badge found");
  const stages = await createDefaultAchievementStages(badge._id);
  if (!stages)
    throw new Error("Error while creating default initial achievements -> No created achievmenets stages found");
  await createDefaultAchievements(stages._id, foundTag._id);
};
