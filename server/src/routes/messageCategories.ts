import { Router } from "express";
import { checkSearchParams, withObjectId } from "@middlewares";
import {
  getMessageCategoriesList,
  editMessageCategoryById,
  addNewCategory,
  deleteMessageCategoryById,
  updateUsesCategoryById
} from "@controllers";

const messageCategoriesRouter = Router();

messageCategoriesRouter.get("/", checkSearchParams, getMessageCategoriesList);
messageCategoriesRouter.post("/create", addNewCategory);
messageCategoriesRouter.patch("/:id", withObjectId(editMessageCategoryById));
messageCategoriesRouter.patch("/:id/uses", withObjectId(updateUsesCategoryById));
messageCategoriesRouter.delete("/delete/:id", withObjectId(deleteMessageCategoryById));

export default messageCategoriesRouter;
