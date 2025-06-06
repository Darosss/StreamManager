import { NextFunction, Request, Response } from "express";
import { RequestParams, RequestSearch } from "../types";
import { filterAffixesByUrlParams } from "./filters";
import {
  createAffix,
  deleteAffixById,
  getAffixes,
  getAffixesCount,
  updateAffixById,
  AffixCreateData,
  AffixUpdateData
} from "@services";

export const getAffixesList = async (req: Request<{}, {}, {}, RequestSearch>, res: Response, next: NextFunction) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterAffixesByUrlParams(req.query);
  try {
    const affixes = await getAffixes(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { createdAt: "asc" }
    });

    const count = await getAffixesCount(searchFilter);

    res.status(200).send({
      data: affixes,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const addNewAffix = async (req: Request<{}, {}, AffixCreateData, {}>, res: Response, next: NextFunction) => {
  const { name, enabled, prefixChance, prefixes, suffixChance, suffixes } = req.body;
  try {
    const newAffix = await createAffix({ name, enabled, prefixChance, prefixes, suffixChance, suffixes });

    res.status(200).send({
      message: "Affix added successfully",
      data: newAffix
    });
  } catch (err) {
    next(err);
  }
};

export const editAffixById = async (
  req: Request<RequestParams, {}, AffixUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, enabled, prefixes, suffixes, prefixChance, suffixChance } = req.body;

  try {
    const updatedAffix = await updateAffixById(id, { name, enabled, prefixes, suffixes, prefixChance, suffixChance });

    res.status(200).send({
      message: "Affix updated successfully",
      data: updatedAffix
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAffix = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await deleteAffixById(id);

    res.status(200).send({ message: "Affix deleted successfully" });
  } catch (err) {
    next(err);
  }
};
