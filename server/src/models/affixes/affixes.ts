import { baseChatFeaturesFields, prefixChanceField, prefixesField, suffixChanceField, suffixesField } from "@utils";
import { model, Schema } from "mongoose";
import { AffixDocument } from "./types";

const AffixSchema: Schema<AffixDocument> = new Schema(
  {
    ...baseChatFeaturesFields,
    ...suffixChanceField,
    ...prefixChanceField,
    ...prefixesField,
    ...suffixesField
  },
  { timestamps: true }
);

export const Affix = model("Affixes", AffixSchema);
