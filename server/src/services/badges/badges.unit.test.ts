import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  Badge: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

jest.mock("@services", () => ({
  getAchievementStages: jest.fn()
}));

jest.mock("fs", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actualFs = jest.requireActual<any>("fs");
  return {
    ...actualFs,
    promises: {
      ...actualFs.promises,
      unlink: jest.fn()
    }
  };
});
import { Badge, BadgeModel, BadgeCreateData } from "@models";
import { getAchievementStages } from "@services";
import * as BadgesService from "./badges";
import { promises as fsPromises } from "fs";
import { Types } from "mongoose";

const createFakeBadge = (): BadgeModel => ({
  _id: new Types.ObjectId(),
  name: "Test Badge",
  imagesUrls: {
    x32: "test-32.png",
    x64: "test-64.png",
    x96: "test-96.png",
    x128: "test-128.png"
  },
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Badges Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getBadges", () => {
    it("should query badges with pagination and return the result", async () => {
      const fakeBadges = [createFakeBadge()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn<() => Promise<BadgeModel[]>>().mockResolvedValue(fakeBadges)
      };

      const findSpy = jest.spyOn(Badge, "find").mockReturnValue(queryChain as never);

      const result = await BadgesService.getBadges(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeBadges);
    });
  });

  describe("getBadgesCount", () => {
    it("should return the count of badges for a filter", async () => {
      const countSpy = jest.spyOn(Badge, "countDocuments").mockResolvedValue(5);

      const result = await BadgesService.getBadgesCount({ name: "Test Badge" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Test Badge" });
      expect(result).toBe(5);
    });
  });

  describe("createBadge", () => {
    it("should create a badge and return it", async () => {
      const fakeBadge = createFakeBadge();
      const createSpy = jest.spyOn(Badge, "create").mockResolvedValue(fakeBadge as never);
      const createData: BadgeCreateData = {
        name: "Test Badge",
        imagesUrls: {
          x32: "test-32.png",
          x64: "test-64.png",
          x96: "test-96.png",
          x128: "test-128.png"
        }
      };

      const result = await BadgesService.createBadge(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeBadge);
    });
  });

  describe("getBadgeById", () => {
    it("should find a badge by id and return it", async () => {
      const fakeBadge = createFakeBadge();
      const queryChain = {
        select: jest.fn<() => Promise<BadgeModel>>().mockResolvedValue(fakeBadge)
      };

      const findByIdSpy = jest.spyOn(Badge, "findById").mockReturnValue(queryChain as never);

      const result = await BadgesService.getBadgeById(fakeBadge._id, { select: { __v: 0 } });

      expect(findByIdSpy).toHaveBeenCalledWith(fakeBadge._id);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(result).toEqual(fakeBadge);
    });
  });

  describe("updateBadgeById", () => {
    it("should update a badge by id and return it", async () => {
      const fakeBadge = createFakeBadge();
      const updateSpy = jest.spyOn(Badge, "findByIdAndUpdate").mockResolvedValue(fakeBadge);

      const result = await BadgesService.updateBadgeById(fakeBadge._id, { $set: { name: "Updated" } });

      expect(updateSpy).toHaveBeenCalledWith(fakeBadge._id, { $set: { name: "Updated" } }, { new: true });
      expect(result).toEqual(fakeBadge);
    });
  });

  describe("deleteBadgeById", () => {
    it("should throw when the badge is used in achievement stages", async () => {
      const stageName = "Stage 1";
      jest.mocked(getAchievementStages).mockResolvedValue([{ name: stageName }] as never);

      const badgeId = new Types.ObjectId();
      await expect(BadgesService.deleteBadgeById(badgeId)).rejects.toThrow(
        `Badge with id(${badgeId}) is used in stage(s): [${stageName}], cannot delete`
      );
    });

    it("should delete the badge when it is not used", async () => {
      jest.mocked(getAchievementStages).mockResolvedValue([]);
      const deleteSpy = jest.spyOn(Badge, "findByIdAndDelete").mockResolvedValue(null);
      const badgeId = new Types.ObjectId();
      const result = await BadgesService.deleteBadgeById(badgeId);

      expect(deleteSpy).toHaveBeenCalledWith(badgeId);
      expect(result).toEqual({ message: "Successfully deleted badge" });
    });
  });

  describe("deleteBadgeImages", () => {
    it("should throw when a badge image is used by any badge", async () => {
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([{ name: "Test Badge" }] as never)
      };
      jest.spyOn(Badge, "find").mockReturnValue(queryChain as never);

      await expect(
        BadgesService.deleteBadgeImages({ name: "test", extension: ".png", sizesToDelete: [32, 64] })
      ).rejects.toThrow("At least one badge image with name: (test) is used in badge(s): [Test Badge], cannot delete");
    });

    it("should delete badge image files when no badge references them", async () => {
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn<() => Promise<BadgeModel[]>>().mockResolvedValue([] as never)
      };
      jest.spyOn(Badge, "find").mockReturnValue(queryChain as never);
      const unlinkSpy = jest.spyOn(fsPromises, "unlink").mockResolvedValue(undefined);

      const result = await BadgesService.deleteBadgeImages({
        name: "test",
        extension: ".png",
        sizesToDelete: [32, 64]
      });

      expect(unlinkSpy).toHaveBeenCalledTimes(3);
      expect(result).toBe("Badge images test deleted successfully");
    });
  });
});
