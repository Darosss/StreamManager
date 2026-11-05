import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  Mood: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn()
  }
}));

jest.mock("@services", () => ({
  getChatCommandsCount: jest.fn(),
  getMessageCategoriesCount: jest.fn(),
  getTimersCount: jest.fn(),
  getTriggersCount: jest.fn()
}));

import { Mood, MoodModel, MoodCreateData } from "@models";
import { getChatCommandsCount, getMessageCategoriesCount, getTimersCount, getTriggersCount } from "@services";
import * as MoodsService from "./moods";
import { Types } from "mongoose";

const createFakeMood = (): MoodModel => ({
  _id: new Types.ObjectId(),
  name: "Happy",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  enabled: true
});

describe("Moods Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getMoods", () => {
    it("should query moods with pagination and return the result", async () => {
      const fakeMoods = [createFakeMood()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn<() => Promise<MoodModel[]>>().mockResolvedValue(fakeMoods)
      };

      const findSpy = jest.spyOn(Mood, "find").mockReturnValue(queryChain as never);

      const result = await MoodsService.getMoods(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeMoods);
    });
  });

  describe("getMoodsCount", () => {
    it("should return the count of moods for a filter", async () => {
      const countSpy = jest.spyOn(Mood, "countDocuments").mockResolvedValue(3);

      const result = await MoodsService.getMoodsCount({ name: "Happy" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Happy" });
      expect(result).toBe(3);
    });
  });

  describe("createMood", () => {
    it("should create a mood and return it", async () => {
      const fakeMood = createFakeMood();
      const createSpy = jest.spyOn(Mood, "create").mockResolvedValue(fakeMood as never);
      const createData: MoodCreateData = { name: fakeMood.name, enabled: fakeMood.enabled };

      const result = await MoodsService.createMood(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeMood);
    });
  });

  describe("updateMoods", () => {
    it("should update many moods with the given filter and data", async () => {
      const updateManySpy = jest.spyOn(Mood, "updateMany").mockResolvedValue({} as never);

      await MoodsService.updateMoods({ name: "Happy" }, { name: "Excited" });

      expect(updateManySpy).toHaveBeenCalledWith({ name: "Happy" }, { name: "Excited" });
    });
  });

  describe("updateMoodById", () => {
    it("should update a mood and return it", async () => {
      const fakeMood = createFakeMood();
      const updateSpy = jest.spyOn(Mood, "findByIdAndUpdate").mockResolvedValue(fakeMood);

      const moodId = new Types.ObjectId();
      const result = await MoodsService.updateMoodById(moodId, { name: "Excited" });

      expect(updateSpy).toHaveBeenCalledWith(moodId, { name: "Excited" }, { new: true });
      expect(result).toBe(fakeMood);
    });
  });

  describe("deleteMoodById", () => {
    it("should delete a mood when it is not used elsewhere", async () => {
      const fakeMood = createFakeMood();
      const deleteSpy = jest.spyOn(Mood, "findByIdAndDelete").mockResolvedValue(fakeMood);
      jest.mocked(getTriggersCount).mockResolvedValue(0);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0);
      jest.mocked(getTimersCount).mockResolvedValue(0);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0);
      const moodId = new Types.ObjectId();

      const result = await MoodsService.deleteMoodById(moodId);

      expect(deleteSpy).toHaveBeenCalledWith(moodId);
      expect(result).toBe(fakeMood);
    });

    it("should throw when the mood is used by another document", async () => {
      const moodId = new Types.ObjectId();

      jest.mocked(getTriggersCount).mockResolvedValue(1);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0);
      jest.mocked(getTimersCount).mockResolvedValue(0);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0);

      await expect(MoodsService.deleteMoodById(moodId)).rejects.toThrow();
    });
  });

  describe("getMoodById", () => {
    it("should return a mood when one exists", async () => {
      const moodId = new Types.ObjectId();

      const fakeMood = createFakeMood();
      const findByIdSpy = jest.spyOn(Mood, "findById").mockResolvedValue(fakeMood);

      const result = await MoodsService.getMoodById(moodId, { name: 1 });

      expect(findByIdSpy).toHaveBeenCalledWith(moodId, { name: 1 });
      expect(result).toBe(fakeMood);
    });
  });

  describe("getOneMood", () => {
    it("should return the first matching mood", async () => {
      const fakeMood = createFakeMood();
      jest.spyOn(Mood, "findOne").mockResolvedValue(fakeMood as never);

      const result = await MoodsService.getOneMood({ name: fakeMood.name });

      expect(result).toBe(fakeMood);
    });
  });
});
