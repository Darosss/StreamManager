import { Model, model, Schema } from "mongoose";
import {
  AchievementCustomModel,
  AchievementDocument,
  AchievementStageDocument,
  AchievementUserProgressDocument
} from "./types";
import { CustomAchievementAction } from "./enums";
import { enabledField, tagModeField } from "@utils";

const AchievementStageSchema = new Schema<AchievementStageDocument>(
  {
    name: { type: String, required: true, unique: true },
    stageData: [
      {
        name: { type: String, required: true },
        stage: { type: Number, required: true },
        goal: { type: Number, required: true },
        badge: { type: Schema.Types.ObjectId, required: true, ref: "Badge" },
        sound: { type: String },
        rarity: { type: Number },
        showTimeMs: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

const AchievementCustomSchema: Schema<AchievementCustomModel> = new Schema({
  stringValues: { type: [String] },
  numberValue: { type: Number },
  caseSensitive: { type: Boolean },
  action: {
    type: String,
    default: CustomAchievementAction.INCLUDES,
    enum: Object.values(CustomAchievementAction)
  }
});

const AchivementSchema: Schema<AchievementDocument> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    stages: { type: Schema.Types.ObjectId, required: true, ref: "AchievementStage" },
    isTime: { type: Boolean, required: true, default: false },
    ...tagModeField,
    ...enabledField,
    custom: { type: AchievementCustomSchema },
    hidden: { type: Boolean },
    showProgress: { type: Boolean }
  },
  { timestamps: true }
);

const AchievementUserProgressSchema: Schema<AchievementUserProgressDocument> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    achievement: { type: Schema.Types.ObjectId, required: true, ref: "Achievement" },
    value: { type: Number, required: true, default: 0 },
    progresses: [[Number, Date]],
    progressesLength: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const AchievementUserProgress: Model<AchievementUserProgressDocument> = model(
  "AchievementProgress",
  AchievementUserProgressSchema
);
export const AchievementStage: Model<AchievementStageDocument> = model("AchievementStage", AchievementStageSchema);
export const Achievement: Model<AchievementDocument> = model("Achievement", AchivementSchema);
