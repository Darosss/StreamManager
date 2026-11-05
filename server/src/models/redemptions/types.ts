import { Document, Types } from "mongoose";
import { UserModel } from "../users";

export interface RedemptionModel {
  _id: Types.ObjectId;
  rewardId: string;
  userId: Types.ObjectId | UserModel;
  twitchId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
  message?: string;
}

export type RedemptionDocument = RedemptionModel & Document;
