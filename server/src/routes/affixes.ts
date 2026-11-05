import { withObjectId, checkSearchParams } from "@middlewares";
import { Router } from "express";

import { getAffixesList, addNewAffix, editAffixById, deleteAffix } from "@controllers";

const affixesRouter = Router();

affixesRouter.get("/", checkSearchParams, getAffixesList);
affixesRouter.post("/create", addNewAffix);
affixesRouter.patch("/:id", withObjectId(editAffixById));
affixesRouter.delete("/delete/:id", withObjectId(deleteAffix));

export default affixesRouter;
