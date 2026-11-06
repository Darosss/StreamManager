import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CustomAchievementAction: jest.requireActual<any>("../../models/achievements/enums")
    .CustomAchievementAction as typeof CustomAchievementAction,
  Achievement: {
    find: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn()
  }
}));
import { Achievement, CustomAchievementAction, AchievementStageModel, AchievementModel } from "@models";
import * as AchievementsService from "./achievements";
import { Types } from "mongoose";
import { AchievementCreateData } from "./types";
const createFakeTag = () => ({
  _id: new Types.ObjectId()
});

const createFakeStage = (): AchievementStageModel => ({
  _id: new Types.ObjectId(),
  name: "",
  stageData: [],
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});
const createFakeAchievement = (): AchievementModel => ({
  _id: new Types.ObjectId(),
  name: "Test Achievement",
  stages: [] as never,
  tag: createFakeTag()._id,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  description: "Test achievement desc",
  isTime: false,
  enabled: false
});

describe("Achievements Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAchievements", () => {
    it("should query achievements with pagination and populate stages and tag", async () => {
      const fakeAchievements = [createFakeAchievement()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn<() => Promise<AchievementModel[]>>().mockResolvedValue(fakeAchievements)
      };

      const findSpy = jest.spyOn(Achievement, "find").mockReturnValue(queryChain as never);

      const result = await AchievementsService.getAchievements(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } },
        { stages: true, stagesBadge: true, tag: true }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalled();
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeAchievements);
    });
  });

  describe("createAchievement", () => {
    it("should create a new achievement", async () => {
      const fakeAchievement = createFakeAchievement();
      const createSpy = jest.spyOn(Achievement, "create").mockResolvedValue(fakeAchievement as never);
      const achCreateData: AchievementCreateData = {
        name: fakeAchievement.name,
        description: fakeAchievement.description,
        stages: fakeAchievement.stages,
        tag: fakeAchievement.tag
      };
      const result = await AchievementsService.createAchievement(achCreateData);

      expect(createSpy).toHaveBeenCalledWith(achCreateData);
      expect(result).toBe(fakeAchievement);
    });
  });

  describe("getAchievementsCount", () => {
    it("should return the count of achievements", async () => {
      const countSpy = jest.spyOn(Achievement, "countDocuments").mockResolvedValue(7);

      const result = await AchievementsService.getAchievementsCount({ name: "Test Achievement" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Test Achievement" });
      expect(result).toBe(7);
    });
  });

  describe("getOneAchievement", () => {
    it("should find one achievement and populate stages and tag", async () => {
      const fakeAchievement = createFakeAchievement();
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn<() => Promise<AchievementModel>>().mockResolvedValue(fakeAchievement)
      };

      const findOneSpy = jest.spyOn(Achievement, "findOne").mockReturnValue(queryChain as never);

      const result = await AchievementsService.getOneAchievement({}, { select: { __v: 0 } }, true);

      expect(findOneSpy).toHaveBeenCalledWith({});
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalled();
      expect(result).toEqual(fakeAchievement);
    });
  });

  describe("updateOneAchievement", () => {
    it("should update an achievement and return it", async () => {
      const fakeAchievement = createFakeAchievement();
      const updateSpy = jest.spyOn(Achievement, "findOneAndUpdate").mockResolvedValue(fakeAchievement);

      const result = await AchievementsService.updateOneAchievement(
        { name: "Test Achievement" },
        { $set: { name: "Updated" } }
      );

      expect(updateSpy).toHaveBeenCalledWith(
        { name: "Test Achievement" },
        { $set: { name: "Updated" } },
        { new: true }
      );
      expect(result).toEqual(fakeAchievement);
    });
  });
  describe("updateOneCustomAchievement", () => {
    it("should update a custom achievement and return it", async () => {
      const fakeAchievement = createFakeAchievement();
      const updateSpy = jest.spyOn(Achievement, "findOneAndUpdate").mockResolvedValue(fakeAchievement);
      const result = await AchievementsService.updateOneCustomAchievement(
        { name: "Custom Test Achievement" },
        { $set: { name: "Updated" } }
      );

      expect(updateSpy).toHaveBeenCalledWith(
        { name: "Custom Test Achievement", custom: { $exists: true } },
        { $set: { name: "Updated" } },
        { new: true }
      );
      expect(result).toEqual(fakeAchievement);
    });
  });

  describe("createCustomAchievement", () => {
    it("should create a custom achievement with valid includes action", async () => {
      const fakeAchievement = createFakeAchievement();
      const createSpy = jest.spyOn(Achievement, "create").mockResolvedValue(fakeAchievement as never);

      const result = await AchievementsService.createCustomAchievement({
        name: "Custom Achievement",
        custom: { action: CustomAchievementAction.INCLUDES, stringValues: ["hello"] },
        description: "custom achievement description",
        stages: createFakeStage()._id,
        tag: createFakeTag()._id
      });
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ isTime: false }));
      expect(result).toBe(fakeAchievement);
    });

    it("should throw when custom includes action has no string values", async () => {
      await expect(
        AchievementsService.createCustomAchievement({
          name: "Custom Achievement",
          custom: { action: CustomAchievementAction.INCLUDES, stringValues: [] },
          description: "custom achievement description",
          stages: createFakeStage()._id,
          tag: createFakeTag()._id
        })
      ).rejects.toThrow();
    });

    it("should throw when custom message action has no number value", async () => {
      await expect(
        AchievementsService.createCustomAchievement({
          name: "Custom Achievement",
          custom: { action: CustomAchievementAction.MESSAGE_GT },
          description: "custom achievement description",
          stages: createFakeStage()._id,
          tag: createFakeTag()._id
        })
      ).rejects.toThrow();
    });
  });

  describe("deleteOneAchievement", () => {
    it("should delete an achievement by filter and return a success message", async () => {
      const deleteSpy = jest.spyOn(Achievement, "findOneAndDelete").mockResolvedValue(createFakeAchievement() as never);

      const result = await AchievementsService.deleteOneAchievement({ name: "Test Achievement" });

      expect(deleteSpy).toHaveBeenCalledWith({ name: "Test Achievement" });
      expect(result).toEqual({ message: "Successfully removed achievement" });
    });
  });

  describe("deleteCustomAchievementById", () => {
    it("should delete a custom achievement by id", async () => {
      const deleteSpy = jest.spyOn(Achievement, "findOneAndDelete").mockResolvedValue(createFakeAchievement() as never);

      const achievementId = new Types.ObjectId();
      const result = await AchievementsService.deleteCustomAchievementById(achievementId);

      expect(deleteSpy).toHaveBeenCalledWith({ _id: achievementId, custom: { $exists: true } });
      expect(result).toEqual({ message: "Successfully removed custom achievement" });
    });
  });
});
