import { checkSearchParams, withObjectId } from "@middlewares";
import { Router } from "express";

import { getTimersList, addNewTimer, editTimerById, deleteTimer } from "@controllers";

const timersRouter = Router();

timersRouter.get("/", checkSearchParams, getTimersList);
timersRouter.post("/create", addNewTimer);
timersRouter.patch("/:id", withObjectId(editTimerById));
timersRouter.delete("/delete/:id", withObjectId(deleteTimer));

export default timersRouter;
