import { NextFunction, Request, Response } from "express";
import { RequestQueryLatestEldestMsgs, RequestQueryUser } from "./types";
import { filterUsersByUrlParams } from "./filters";
import {
  getUserById,
  getUserCount,
  getUsers,
  updateUserById,
  getMessages,
  getMessagesCount,
  getRedemptions,
  getRedemptionsCount
} from "@services";
import { AppError } from "@utils";
import { filterMessagesByUrlParams } from "../messages";
import { RequestRedemptionQuery, filterRedemptionsByUrlParams } from "../redemptions";
import { RequestParams } from "../types";
import { RequestQueryMessage } from "../messages";
import { UserUpdateData } from "@models";
import mongoose from "mongoose";
import { RequestWithObjectId } from "@middlewares";

export const getUsersList = async (req: Request<{}, {}, {}, RequestQueryUser>, res: Response, next: NextFunction) => {
  const { page = 1, limit = 50, sortBy = "lastSeen", sortOrder = "desc" } = req.query;
  const searchFilter = filterUsersByUrlParams(req.query);

  try {
    const users = await getUsers(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getUserCount(searchFilter);

    res.status(200).send({
      data: users,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getUsersByIds = async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) throw new AppError(400, "Id not provided");
  const ids = id.split(",").filter(mongoose.isValidObjectId);
  const usersByIdFilter = { _id: { $in: ids } };

  try {
    const users = await getUsers(usersByIdFilter, {});

    const count = await getUserCount(usersByIdFilter);

    res.status(200).send({
      data: users,
      count: count
    });
  } catch (err) {
    next(err);
  }
};

export const getUsersProfile = async (req: RequestWithObjectId, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(req.objectId, { select: { __v: 0 } });

    res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

export const editUserProfile = async (
  req: RequestWithObjectId<RequestParams, {}, UserUpdateData>,
  res: Response,
  next: NextFunction
) => {
  const { notes } = req.body;

  try {
    await updateUserById(req.objectId, { notes });
    res.status(200).send({ message: "User updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const getUserMessages = async (
  req: RequestWithObjectId<RequestParams, {}, {}, RequestQueryMessage>,
  res: Response,
  next: NextFunction
) => {
  const id = req.objectId;
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = Object.assign({ owner: id }, await filterMessagesByUrlParams(req.query));

  try {
    const messages = await getMessages(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { date: -1 },
      select: { __v: 0 }
    });
    const count = await getMessagesCount(searchFilter);

    res.status(200).send({
      data: messages,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getUserRedemptions = async (
  req: RequestWithObjectId<RequestParams, {}, {}, RequestRedemptionQuery>,
  res: Response,
  next: NextFunction
) => {
  const id = req.objectId;
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = Object.assign({ userId: id }, filterRedemptionsByUrlParams(req.query));

  try {
    const redemptions = await getRedemptions(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { redemptionDate: -1 }
    });

    const count = await getRedemptionsCount(searchFilter);

    res.status(200).send({
      data: redemptions,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getLatestEldestUserMessages = async (
  req: RequestWithObjectId<RequestParams, {}, {}, RequestQueryLatestEldestMsgs>,
  res: Response,
  next: NextFunction
) => {
  const id = req.objectId;
  const { limit = 6 } = req.query;

  try {
    const firstMessages = await getMessages(
      { owner: id },
      {
        limit: Number(limit),
        sort: { date: 1 },
        select: { __v: 0 }
      }
    );
    const latestMessages = await getMessages(
      { owner: id },
      {
        limit: Number(limit),
        sort: { date: -1 },
        select: { __v: 0 }
      }
    );

    res.status(200).send({
      data: { firstMessages: firstMessages, latestMessages: latestMessages }
    });
  } catch (err) {
    next(err);
  }
};
