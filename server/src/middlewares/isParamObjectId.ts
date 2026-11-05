import { RequestParams } from "@controllers";
import { AppError } from "@utils";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Query } from "express-serve-static-core";
import { isObjectIdOrHexString, isValidObjectId, Types } from "mongoose";

export const isParamObjectId = (req: Request<RequestParams>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!Array.isArray(id) && isObjectIdOrHexString(id)) {
    (req as RequestWithObjectId).objectId = new Types.ObjectId(id);
    return next();
  }
  return next(new AppError(400, "Invalid id"));
};

// any - same as for express generic
//  Request<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = QueryString.ParsedQs, Locals extends Record<string, any> = Record<string, any>>
// import Request
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestWithObjectId<P extends RequestParams = RequestParams, ResBody = any, ReqQuery = Query> = Request<
  P,
  ResBody,
  ReqQuery
> & { objectId: Types.ObjectId };

type HandlerWithObjectId = (req: RequestWithObjectId, res: Response, next: NextFunction) => unknown;

export const withObjectId =
  (fn: HandlerWithObjectId): RequestHandler =>
  (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return next(new AppError(400, "Invalid id"));

    (req as RequestWithObjectId).objectId = new Types.ObjectId(id as string);

    return fn(req as RequestWithObjectId, res, next);
  };
