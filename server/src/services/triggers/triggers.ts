import { Trigger, TriggerDocument } from "@models";
import { checkExistResource, AppError, handleAppError, logger } from "@utils";
import { modesPipeline } from "../aggregations";
import { QueryFilter, PipelineStage, UpdateQuery, ProjectionType } from "mongoose";
import { ManyTriggersFindOptions, TriggerCreateData, TriggerFindOptions, TriggerUpdateData } from "./types";

export const getTriggers = async (filter: QueryFilter<TriggerDocument> = {}, findOptions: ManyTriggersFindOptions) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 }, populate = [] } = findOptions;

  try {
    const trigger = await Trigger.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .populate(populate)
      .sort(sort);

    return trigger;
  } catch (err) {
    logger.error(`Error occured while getting triggers. ${err}`);
    handleAppError(err);
  }
};

export const getTriggersCount = async (filter: QueryFilter<TriggerDocument> = {}) => {
  return await Trigger.countDocuments(filter);
};

export const createTrigger = async (createData: TriggerCreateData) => {
  try {
    const createdTrigger = await Trigger.create(createData);

    if (!createdTrigger) {
      throw new AppError(400, "Couldn't create new trigger(s");
    }
    return createdTrigger;
  } catch (err) {
    logger.error(`Error occured while creating trigger(s). ${err}`);
    handleAppError(err);
  }
};

export const updateTriggers = async (
  filter: QueryFilter<TriggerDocument> = {},
  updateData: UpdateQuery<TriggerUpdateData>
) => {
  try {
    await Trigger.updateMany(filter, updateData);
  } catch (err) {
    logger.error(`Error occured while updating many triggers. ${err}`);
    handleAppError(err);
  }
};

export const updateTriggerById = async (id: string, updateData: UpdateQuery<TriggerUpdateData>) => {
  try {
    const updatedTrigger = await Trigger.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const trigger = checkExistResource(updatedTrigger, `Trigger with id(${id})`);

    return trigger;
  } catch (err) {
    logger.error(`Error occured while editing trigger by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const deleteTriggerById = async (id: string) => {
  try {
    const deletedTrigger = await Trigger.findByIdAndDelete(id);

    const trigger = checkExistResource(deletedTrigger, `Trigger with id(${id})`);

    return trigger;
  } catch (err) {
    logger.error(`Error occured while deleting trigger by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getTriggerById = async (id: string, projection: ProjectionType<TriggerDocument> = {}) => {
  try {
    const foundTrigger = await Trigger.findById(id, projection);

    const trigger = checkExistResource(foundTrigger, `Trigger with id(${id})`);

    return trigger;
  } catch (err) {
    logger.error(`Error occured while getting trigger: ${err}`);
    handleAppError(err);
  }
};

export const getOneTrigger = async (filter: QueryFilter<TriggerDocument> = {}, findOptions: TriggerFindOptions) => {
  const { populate = [], select = { __v: 0 } } = findOptions;
  try {
    const foundTrigger = await Trigger.findOne(filter).select(select).populate(populate);

    const trigger = checkExistResource(foundTrigger, "Trigger");

    return trigger;
  } catch (err) {
    logger.error(`Error occured while getting trigger: ${err}`);
    handleAppError(err);
  }
};

export const getTriggersWords = async (modesEnabled = false): Promise<undefined | string[]> => {
  try {
    const pipeline: PipelineStage[] = [
      { $match: { enabled: true } },
      { $group: { _id: null, words: { $push: "$words" } } },
      {
        $project: {
          words: {
            $reduce: {
              input: "$words",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          },
          _id: 0
        }
      },
      { $unwind: "$words" },
      { $addFields: { wordsLower: { $toLower: "$words" } } },
      { $sort: { wordsLower: 1 } },
      { $group: { _id: null, words: { $push: "$wordsLower" } } },
      { $project: { _id: 0, words: 1 } }
    ];

    if (modesEnabled) {
      pipeline.unshift(...modesPipeline);
    }

    const triggerWords = await Trigger.aggregate(pipeline);

    if (triggerWords.length > 0) {
      const words: string[] = triggerWords[0].words;
      return words.sort((a, b) => b.length - a.length);
    }

    return [];
  } catch (err) {
    logger.error(`Error occured while aggregating chat commands for all aliases words: ${err}`);
    handleAppError(err);
  }
};
