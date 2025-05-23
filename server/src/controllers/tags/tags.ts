import { NextFunction, Request, Response } from "express";
import { RequestParams, RequestSearch } from "../types";
import { filterTagsByUrlParams } from "./filters";
import {
  createTag,
  deleteTagById,
  getTags,
  getTagsCount,
  updateTagById,
  TagCreateData,
  TagUpdateData
} from "@services";

export const getTagsList = async (req: Request<{}, {}, {}, RequestSearch>, res: Response, next: NextFunction) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterTagsByUrlParams(req.query);
  try {
    const tags = await getTags(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { createdAt: -1 }
    });

    const count = await getTagsCount(searchFilter);

    res.status(200).send({
      data: tags,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const addNewTag = async (req: Request<{}, {}, TagCreateData, {}>, res: Response, next: NextFunction) => {
  const { name } = req.body;

  try {
    const newTag = await createTag({ name });

    res.status(200).send({ message: "Tag added successfully", data: newTag });
  } catch (err) {
    next(err);
  }
};

export const editTagById = async (
  req: Request<RequestParams, {}, TagUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, enabled } = req.body;

  const updateData = { name, enabled };
  try {
    const updatedTag = await updateTagById(id, updateData);

    res.status(200).send({
      message: "Tag updated successfully",
      data: updatedTag
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTag = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await deleteTagById(id);

    res.status(200).send({ message: "Tag deleted successfully" });
  } catch (err) {
    next(err);
  }
};
