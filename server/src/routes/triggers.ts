import { checkSearchParams, withObjectId } from "@middlewares";
import { Router } from "express";

import { getTriggersList, addNewTrigger, editTriggerById, deleteTrigger } from "@controllers";

const triggersRouter = Router();

triggersRouter.get("/", checkSearchParams, getTriggersList);
triggersRouter.post("/create", addNewTrigger);
triggersRouter.patch("/:id", withObjectId(editTriggerById));
triggersRouter.delete("/delete/:id", withObjectId(deleteTrigger));

export default triggersRouter;
