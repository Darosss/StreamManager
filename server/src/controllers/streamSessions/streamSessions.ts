import { Request, Response, NextFunction } from "express";
import { RequestParams } from "../types";
import { filterSessionByUrlParams } from "./filters";
import { RequestQueryMessage, filterMessagesByUrlParams } from "../messages";
import { RequestRedemptionQuery, filterRedemptionsByUrlParams } from "../redemptions";
import {
  getCurrentStreamSession,
  getStreamSessionStatistics,
  getStreamSessions,
  getStreamSessionsCount,
  getStreamSessionById,
  getLatestStreamSession,
  getMessages,
  getMessagesCount,
  getRedemptions,
  getRedemptionsCount
} from "@services";
import { RequestQuerySession } from "./types";

export const getStreamSessionsList = async (
  req: Request<{}, {}, {}, RequestQuerySession>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50, sortBy = "sessionStart", sortOrder = "desc" } = req.query;

  const searchFilter = filterSessionByUrlParams(req.query);
  try {
    const streamSessions = await getStreamSessions(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getStreamSessionsCount(searchFilter);

    res.status(200).send({
      data: streamSessions,
      totalPages: Math.ceil(count / Number(limit)),
      count: Number(count),
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let streamSession = await getCurrentStreamSession({});

    if (!streamSession) streamSession = await getLatestStreamSession({});

    res.status(200).send({
      data: streamSession
    });
  } catch (err) {
    next(err);
  }
};

export const getSessionById = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const streamSession = await getStreamSessionById(id, {});

    res.status(200).send({
      data: streamSession
    });
  } catch (err) {
    next(err);
  }
};

export const getSessionStatisticsById = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const streamSession = await getStreamSessionById(id, {});
    if (streamSession) {
      const sessionStatstics = await getStreamSessionStatistics(streamSession, {
        limitMostUsedWords: 10,
        limitTopMessageUsers: 10,
        limitTopRedemptionsUsers: 10,
        limitViewers: 0
      });

      res.status(200).send({
        data: sessionStatstics
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getCurrentSessionMessages = async (
  req: Request<{}, {}, {}, RequestQueryMessage>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  try {
    let streamSession = await getCurrentStreamSession({});

    if (!streamSession) {
      streamSession = await getLatestStreamSession({});
    }
    const searchFilter = Object.assign(
      {
        date: {
          $gte: streamSession?.sessionStart,
          $lte: streamSession?.sessionEnd
        }
      },
      await filterMessagesByUrlParams(req.query)
    );

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

export const getCurrentSessionRedemptions = async (
  req: Request<{}, {}, {}, RequestRedemptionQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  try {
    let streamSession = await getCurrentStreamSession({});

    if (!streamSession) {
      streamSession = await getLatestStreamSession({});
    }
    const searchFilter = Object.assign(
      {
        redemptionDate: {
          $gte: streamSession?.sessionStart,
          $lte: streamSession?.sessionEnd
        }
      },
      filterRedemptionsByUrlParams(req.query)
    );
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

export const getCurrentSessionStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const streamSession = (await getCurrentStreamSession({})) || (await getLatestStreamSession({}));

    if (streamSession) {
      const sessionStatstics = await getStreamSessionStatistics(streamSession, {});
      res.status(200).send({
        data: sessionStatstics
      });
    } else {
      res.status(200).send({
        data: null
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getSessionMessages = async (
  req: Request<RequestParams, {}, {}, RequestQueryMessage>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  try {
    const session = await getStreamSessionById(id, { select: { __v: 0 } });

    const searchFilter = Object.assign(
      {
        date: {
          $gte: session?.sessionStart,
          $lte: session?.sessionEnd
        }
      },
      await filterMessagesByUrlParams(req.query)
    );

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

export const getSessionRedemptions = async (
  req: Request<RequestParams, {}, {}, RequestRedemptionQuery>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  try {
    const session = await getStreamSessionById(id, { select: { __v: 0 } });

    const searchFilter = Object.assign(
      {
        redemptionDate: {
          $gte: session?.sessionStart,
          $lte: session?.sessionEnd
        }
      },
      filterRedemptionsByUrlParams(req.query)
    );
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
