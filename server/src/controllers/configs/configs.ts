import { NextFunction, Request, Response } from "express";
import { getConfigs, updateConfigs } from "@services";
import { configDefaults } from "@defaults";
import { ConfigUpdateData } from "@models";
import { flattenObject } from "@utils";

export const getConfigsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const configs = await getConfigs();

    res.status(200).send({ data: configs });
  } catch (err) {
    next(err);
  }
};

export const editConfigs = async (req: Request<{}, {}, ConfigUpdateData, {}>, res: Response, next: NextFunction) => {
  const {
    commandsConfigs,
    timersConfigs,
    chatGamesConfigs,
    triggersConfigs,
    pointsConfigs,
    loyaltyConfigs,
    musicConfigs,
    headConfigs
  } = req.body;

  const updateData = {
    commandsConfigs,
    timersConfigs,
    chatGamesConfigs,
    triggersConfigs,
    pointsConfigs,
    musicConfigs,
    loyaltyConfigs,
    headConfigs
  };
  try {
    const configs = await updateConfigs(flattenObject(updateData));
    res.status(200).send({ message: "Configs updated successfully", data: configs });
  } catch (err) {
    next(err);
  }
};

export const resetConfigsToDefaults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const configs = await updateConfigs(flattenObject(configDefaults));

    res.status(200).send({ message: "Configs reset to default successfully", data: configs });
  } catch (err) {
    next(err);
  }
};
