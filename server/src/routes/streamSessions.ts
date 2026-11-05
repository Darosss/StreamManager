import { Router } from "express";
import {
  getStreamSessionsList,
  getCurrentSession,
  getCurrentSessionStatistics,
  getSessionById,
  getSessionStatisticsById,
  getSessionMessages,
  getSessionRedemptions,
  getCurrentSessionMessages,
  getCurrentSessionRedemptions
} from "@controllers";
import { checkSearchParams, withObjectId } from "@middlewares";

const streamSessionsRouter = Router();

streamSessionsRouter.get("/", checkSearchParams, getStreamSessionsList);
streamSessionsRouter.get("/current-session", getCurrentSession);
streamSessionsRouter.get("/current-session/messages", getCurrentSessionMessages);
streamSessionsRouter.get("/current-session/redemptions", getCurrentSessionRedemptions);
streamSessionsRouter.get("/current-session/statistics", getCurrentSessionStatistics);
streamSessionsRouter.get("/:id", withObjectId(getSessionById));
streamSessionsRouter.get("/:id/messages", withObjectId(getSessionMessages));
streamSessionsRouter.get("/:id/redemptions", withObjectId(getSessionRedemptions));
streamSessionsRouter.get("/:id/statistics", withObjectId(getSessionStatisticsById));

export default streamSessionsRouter;
