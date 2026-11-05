import { Types } from "mongoose";

export interface UpdateAchievementUserProgressProgressesArgs {
  achievementName: string;
  userId: Types.ObjectId;
  progress: { increment?: boolean; value: number };
}
