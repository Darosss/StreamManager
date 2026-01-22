import { Types } from "mongoose";

export interface BaseModel {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrefixSuffixChancesConfig {
  suffixChance: number;
  prefixChance: number;
}
