import { baseChatFeaturesFields } from "@utils";
import { model, Schema } from "mongoose";
import { TagDocument } from "./types";

const TagSchema: Schema<TagDocument> = new Schema(
  {
    ...baseChatFeaturesFields
  },
  { timestamps: true }
);

export const Tag = model("Tags", TagSchema);
