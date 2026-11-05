import { Router } from "express";
import { getOverlaysList, addNewOverlay, editOverlayById, removeOverlayById, getOverlayById } from "@controllers";
import { withObjectId } from "@middlewares";
const overlayRouter = Router();

overlayRouter.get("/", getOverlaysList);
overlayRouter.post("/create", addNewOverlay);
overlayRouter.get("/:id", withObjectId(getOverlayById));
overlayRouter.patch("/:id", withObjectId(editOverlayById));
overlayRouter.delete("/delete/:id", withObjectId(removeOverlayById));

export default overlayRouter;
