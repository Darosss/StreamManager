import { z } from "zod";
import mongoose from "mongoose";

export const zObjectId = () =>
  z
    .string()
    .refine((val) => mongoose.isValidObjectId(val), {
      message: "Invalid MongoDB ObjectId"
    })
    .transform((val) => new mongoose.Types.ObjectId(val));
