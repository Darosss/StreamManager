import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  AchievementUserProgress: {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn()
  }
}));

jest.mock("@services", () => ({
  getOneAchievement: jest.fn(),
  getUserById: jest.fn()
}));

import {
  AchievementUserProgress,
  AchievementUserProgressModel,
  AchievementWithBadgePopulated,
  BadgeModel
} from "@models";
import { getUserById, UpdateAchievementUserProgressProgressesReturnData } from "@services";
import * as AchievementUserProgressesService from "./achivementUserProgresses";
import mongoose, { Types } from "mongoose";

const createFakeTag = () => ({
  _id: new Types.ObjectId()
});
const createFakeBadge = (): BadgeModel => ({
  _id: new mongoose.Types.ObjectId(),
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  name: "badge-name",
  imagesUrls: {
    x32: "x32.png",
    x64: "x64.png",
    x96: "x96.png",
    x128: "x128.png"
  }
});
const createFakeAchievement = (): AchievementWithBadgePopulated => ({
  _id: new Types.ObjectId(),
  name: "Test Achievement",
  stages: {
    stageData: [
      {
        stage: 1,
        goal: 5,
        name: "badge-1",
        badge: createFakeBadge(),
        showTimeMs: 500
      },
      {
        stage: 2,
        goal: 10,
        name: "badge-2",
        badge: createFakeBadge(),
        showTimeMs: 1000
      }
    ],
    name: "stage-name",
    _id: new Types.ObjectId(),
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  },
  tag: createFakeTag()._id,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  description: "",
  isTime: false,
  enabled: false
});

const createFakeProgress = (): AchievementUserProgressModel => ({
  _id: new Types.ObjectId(),
  achievement: createFakeAchievement()._id,
  userId: new Types.ObjectId(),
  value: 5,
  progresses: [],
  progressesLength: 0,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Achievement User Progresses Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAchievementUserProgresses", () => {
    it("should query progress documents with populate options", async () => {
      const fakeProgresses = [createFakeProgress()];
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(fakeProgresses as never)
      };
      const findSpy = jest.spyOn(AchievementUserProgress, "find").mockReturnValue(queryChain as never);

      const result = await AchievementUserProgressesService.getAchievementUserProgresses(
        {},
        { select: { __v: 0 }, populate: { achievements: { value: true, stages: { value: true, badges: true } } } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalled();
      expect(result).toEqual(fakeProgresses);
    });
  });

  describe("getOneAchievementUserProgress", () => {
    it("should return a single achievement progress", async () => {
      const fakeProgress = createFakeProgress();
      const findOneSpy = jest.spyOn(AchievementUserProgress, "findOne").mockResolvedValue(fakeProgress as never);
      const fakeAch = createFakeAchievement();
      const result = await AchievementUserProgressesService.getOneAchievementUserProgress({
        achievement: fakeAch._id
      });

      expect(findOneSpy).toHaveBeenCalledWith({ achievement: fakeAch._id });
      expect(result).toEqual(fakeProgress);
    });
  });

  describe("createAchievementUserProgress", () => {
    it("should return existing progress when one exists", async () => {
      const fakeProgress = createFakeProgress();
      jest
        .spyOn(AchievementUserProgressesService, "getOneAchievementUserProgress")
        .mockResolvedValue(fakeProgress as never);

      const result = await AchievementUserProgressesService.createAchievementUserProgress({
        achievement: fakeProgress.achievement,
        userId: fakeProgress.userId
      });

      expect(result).toBe(fakeProgress);
    });

    it("should create a new progress when none exists", async () => {
      jest.spyOn(AchievementUserProgressesService, "getOneAchievementUserProgress").mockResolvedValue(null);
      const fakeProgress = createFakeProgress();
      const createSpy = jest.spyOn(AchievementUserProgress, "create").mockResolvedValue(fakeProgress as never);

      const result = await AchievementUserProgressesService.createAchievementUserProgress({
        achievement: fakeProgress.achievement,
        userId: fakeProgress.userId
      });

      expect(createSpy).toHaveBeenCalledWith({ achievement: fakeProgress.achievement, userId: fakeProgress.userId });
      expect(result).toBe(fakeProgress);
    });
  });

  describe("updateOneAchievementUserProgress", () => {
    it("should update progress and set progressesLength when progresses are passed", async () => {
      const updateVal = { progresses: [[1, 100]] };
      const fakeProgress = createFakeProgress();
      jest.spyOn(AchievementUserProgress, "findOne").mockResolvedValue({ ...fakeProgress, ...updateVal } as never);
      const updateSpy = jest
        .spyOn(AchievementUserProgress, "findByIdAndUpdate")
        .mockResolvedValue(fakeProgress as never);

      const result = await AchievementUserProgressesService.updateOneAchievementUserProgress(
        { _id: fakeProgress._id },
        updateVal
      );

      expect(updateSpy).toHaveBeenCalledWith(
        fakeProgress._id,
        expect.objectContaining({ ...updateVal, $set: { progressesLength: 1 } }),
        { new: true }
      );
      expect(result).toEqual(fakeProgress);
    });
  });

  describe("getAchievementsProgressesByUserId", () => {
    it("should return progress documents when the user exists", async () => {
      const fakeProgresses = [createFakeProgress()];
      const userId = new Types.ObjectId();
      jest.mocked(getUserById).mockResolvedValue({ id: userId } as never);
      const queryChain = {
        populate: jest.fn().mockResolvedValue(fakeProgresses as never)
      };
      const findSpy = jest.spyOn(AchievementUserProgress, "find").mockReturnValue(queryChain as never);

      const result = await AchievementUserProgressesService.getAchievementsProgressesByUserId(userId);

      expect(getUserById).toHaveBeenCalledWith(userId, {});
      expect(findSpy).toHaveBeenCalledWith({ userId });
      expect(queryChain.populate).toHaveBeenCalledWith({
        path: "achievement",
        populate: {
          path: "stages",
          populate: {
            path: "stageData.badge"
          }
        }
      });
      expect(result).toEqual(fakeProgresses);
    });
  });

  describe("updateFinishedStagesDependsOnProgress", () => {
    it("should finish stages when progress passes stage goals", async () => {
      const fakeAchievement = createFakeAchievement();
      const userProgress = createFakeProgress();
      jest
        .spyOn(AchievementUserProgressesService, "updateOneAchievementUserProgress")
        .mockResolvedValue(userProgress as never);

      const result = await AchievementUserProgressesService.updateFinishedStagesDependsOnProgress(
        fakeAchievement,
        userProgress,
        6
      );

      expect(result.nowFinishedStages.length).toBeGreaterThan(0);
      expect(result.gainedProgress).toBeNull();
    });
  });

  describe("getDataForObtainAchievementEmit", () => {
    it("should build emit data with stages and gained progress", () => {
      const data: UpdateAchievementUserProgressProgressesReturnData = {
        foundAchievement: {
          name: "Test Achievement",
          isTime: false,
          stages: {
            stageData: [
              {
                stage: 1,
                goal: 5,
                name: "Stage name",
                badge: createFakeBadge(),
                showTimeMs: 0
              },
              {
                stage: 2,
                goal: 10,
                name: "Stage name 2",
                badge: createFakeBadge(),
                showTimeMs: 0
              }
            ],
            name: "",
            _id: new Types.ObjectId(),
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z")
          },
          description: "",
          tag: new Types.ObjectId(),
          enabled: false,
          _id: new Types.ObjectId(),
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z")
        },
        nowFinishedStages: [[1, 123456]],
        gainedProgress: { currentStageNumber: null, nextStageNumber: 1, progress: 6 }
      };

      const result = AchievementUserProgressesService.getDataForObtainAchievementEmit(data);

      expect(result.achievement).toEqual({ name: "Test Achievement", isTime: false });
      expect(result.stages).toEqual([{ data: { stage: 1, goal: 5 }, timestamp: 123456 }]);
      expect(result.gainedProgress).toEqual(expect.objectContaining({ progress: 6 }));
    });
  });
});
