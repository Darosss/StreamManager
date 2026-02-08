import { Document } from "mongoose";
import { BaseModel } from "../types";
import { BadgeModel } from "../badges";

export type UserDisplayBadgesType<BadgeType extends string | BadgeModel = string> = [BadgeType, BadgeType, BadgeType];

export interface UserModel<BadgeType extends string | BadgeModel = string> extends BaseModel {
  twitchId: string;
  username: string;
  privileges: number;
  points: number;
  watchTime: number;
  lastSeen?: Date;
  messageCount: number;
  notes?: string[];
  twitchName?: string;
  twitchCreated?: Date;
  follower?: Date;
  displayBadges?: UserDisplayBadgesType<BadgeType>;
}

export type UserDocument = UserModel & Document;
