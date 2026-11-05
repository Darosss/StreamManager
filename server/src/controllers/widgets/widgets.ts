import { NextFunction, Request, Response } from "express";
import {
  createWidget,
  deleteWidgetById,
  getWidgetById as getWidgetByIdService,
  getWidgets,
  getWidgetsCount,
  updateWidgetById
} from "@services";
import { RequestParams, RequestSearch } from "../types";
import { WidgetsCreateData, WidgetsUpdateData } from "@models";
import { RequestWithObjectId } from "@middlewares";

export const getWidgetsList = async (req: Request<{}, {}, {}, RequestSearch>, res: Response, next: NextFunction) => {
  const { page = "1", limit = "25", sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const searchFilter = {};
  try {
    const widgets = await getWidgets(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getWidgetsCount(searchFilter);
    res.status(200).send({
      data: widgets,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getWidgetById = async (req: RequestWithObjectId, res: Response, next: NextFunction) => {
  try {
    const widget = await getWidgetByIdService(req.objectId, {});

    res.status(200).send({
      data: widget
    });
  } catch (err) {
    next(err);
  }
};

export const addNewWidget = async (
  req: Request<RequestParams, {}, WidgetsCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { name, layout, toolbox } = req.body;

  const createData = { name, layout, toolbox };
  try {
    const newWidget = await createWidget(createData);

    res.status(201).send({ message: "Widget added successfully", data: newWidget });
  } catch (err) {
    next(err);
  }
};

export const editWidgetById = async (
  req: RequestWithObjectId<RequestParams, {}, WidgetsUpdateData>,
  res: Response,
  next: NextFunction
) => {
  const { name, layout, toolbox } = req.body;

  const updateData = { name, layout, toolbox };
  try {
    const updatedWidget = await updateWidgetById(req.objectId, updateData);

    res.status(200).send({
      message: "Widget updated successfully",
      data: updatedWidget
    });
  } catch (err) {
    next(err);
  }
};

export const removeWidgetById = async (req: RequestWithObjectId, res: Response, next: NextFunction) => {
  try {
    await deleteWidgetById(req.objectId);

    res.status(200).send({ message: "Widget deleted successfully" });
  } catch (err) {
    next(err);
  }
};
