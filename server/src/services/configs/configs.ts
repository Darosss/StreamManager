import { Config, ConfigUpdateData } from "@models";
import { handleAppError, logger } from "@utils";
import { UpdateQuery } from "mongoose";

export const getConfigs = async () => {
  try {
    const configs = await Config.findOne({}).select({ __v: 0 });
    if (!configs) {
      return await createNewConfig();
    }

    return configs;
  } catch (err) {
    logger.error(`Error occured while getting configs. ${err}`);
    handleAppError(err);
  }
};

export const configExist = async () => {
  return await Config.exists({});
};

export const createNewConfig = async () => {
  try {
    return await Config.create({});
  } catch (err) {
    logger.error(`Error occured while creating new configs. ${err}`);
    handleAppError(err);
  }
};

export const updateConfigs = async (updateData: UpdateQuery<ConfigUpdateData>) => {
  try {
    const config = await Config.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true
    });

    return config;
  } catch (err) {
    logger.error(`Error occured while updating configs. ${err}`);
    handleAppError(err);
  }
};
