import { checkSearchParams, withObjectId } from "@middlewares";
import { Router } from "express";

import { getTagsList, addNewTag, editTagById, deleteTag } from "@controllers";

const tagsRouter = Router();

tagsRouter.get("/", checkSearchParams, getTagsList);
tagsRouter.post("/create", addNewTag);
tagsRouter.patch("/:id", withObjectId(editTagById));
tagsRouter.delete("/delete/:id", withObjectId(deleteTag));

export default tagsRouter;
