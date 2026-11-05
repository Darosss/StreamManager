import { Router } from "express";
import { getWidgetsList, addNewWidget, editWidgetById, removeWidgetById, getWidgetById } from "@controllers";
import { withObjectId } from "@middlewares";
const widgetsRouter = Router();

widgetsRouter.get("/", getWidgetsList);
widgetsRouter.post("/create", addNewWidget);
widgetsRouter.get("/:id", withObjectId(getWidgetById));
widgetsRouter.patch("/:id", withObjectId(editWidgetById));
widgetsRouter.delete("/delete/:id", withObjectId(removeWidgetById));

export default widgetsRouter;
