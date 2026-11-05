import { checkSearchParams, withObjectId } from "@middlewares";
import { Router } from "express";

import { getMoodsList, addNewMood, editMoodById, deleteMood } from "@controllers";

const moodsRouter = Router();

moodsRouter.get("/", checkSearchParams, getMoodsList);
moodsRouter.post("/create", addNewMood);
moodsRouter.patch("/:id", withObjectId(editMoodById));
moodsRouter.delete("/delete/:id", withObjectId(deleteMood));

export default moodsRouter;
