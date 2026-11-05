import { Router } from "express";
import {
  getUsersList,
  getUsersProfile,
  editUserProfile,
  getUserMessages,
  getUserRedemptions,
  getLatestEldestUserMessages,
  getUsersByIds
} from "@controllers";
import { checkSearchParams, withObjectId } from "@middlewares";

const usersRouter = Router();

usersRouter.get("/", checkSearchParams, getUsersList);
usersRouter.get("/by-ids/:id", checkSearchParams, getUsersByIds);
usersRouter.get("/:id", withObjectId(getUsersProfile));
usersRouter.get("/:id/messages", withObjectId(getUserMessages));
usersRouter.get("/:id/redemptions", withObjectId(getUserRedemptions));
usersRouter.get("/:id/messages/latest-eldest", withObjectId(getLatestEldestUserMessages));
usersRouter.patch("/:id", withObjectId(editUserProfile));

export default usersRouter;
