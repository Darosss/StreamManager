import { RequestHandler, Response, Request, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "@utils";

export interface TypedRequest<BodyT> extends Request {
  body: BodyT;
}

export const validateSchema = <BodyType extends z.ZodTypeAny>(schema: BodyType): RequestHandler => {
  return (req: Request<any, any, BodyType, any>, res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      return next(
        new AppError(
          400,
          validationResult.error.issues.map((is) => `${is.path.map((p) => p).join(", ")}: ${is.message}`).join(" & ")
        )
      );

      return;
    }

    req.body = validationResult.data as BodyType;

    next();
  };
};
