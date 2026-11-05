import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { RedemptionCreateData } from "./types";

jest.mock("@models", () => ({
  Redemption: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn()
  }
}));

import { Redemption, RedemptionModel } from "@models";
import * as RedemptionsService from "./redemptions";
import { Types } from "mongoose";

const createFakeRedemption = (): RedemptionModel => ({
  _id: new Types.ObjectId(),
  userId: new Types.ObjectId(),
  rewardCost: 100,
  redemptionDate: new Date("2024-01-01T00:00:00.000Z"),
  rewardId: "reward-id",
  twitchId: "twitch-0d",
  userName: "username",
  userDisplayName: "user-display-name",
  rewardTitle: "reward-title",
  rewardImage: "reward-image"
});

const createFakeTwitch = () => ({ _id: "twitch-1" });
const createFakeReward = () => ({ _id: "reward-1" });

describe("Redemptions Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getRedemptions", () => {
    it("should query redemptions with pagination and return the result", async () => {
      const fakeRedemptions = [createFakeRedemption()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn<() => Promise<RedemptionModel[]>>().mockResolvedValue(fakeRedemptions)
      };

      const findSpy = jest.spyOn(Redemption, "find").mockReturnValue(queryChain as never);

      const result = await RedemptionsService.getRedemptions(
        {},
        { limit: 2, skip: 2, sort: { redemptionDate: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ redemptionDate: -1 });
      expect(result).toEqual(fakeRedemptions);
    });
  });

  describe("getRedemptionsCount", () => {
    it("should return the count of redemptions for a filter", async () => {
      const countSpy = jest.spyOn(Redemption, "countDocuments").mockResolvedValue(4);

      const result = await RedemptionsService.getRedemptionsCount({ userId: "user-1" });

      expect(countSpy).toHaveBeenCalledWith({ userId: "user-1" });
      expect(result).toBe(4);
    });
  });

  describe("createRedemption", () => {
    it("should create a redemption using RedemptionCreateData", async () => {
      const fakeRedemption = createFakeRedemption();
      const createSpy = jest.spyOn(Redemption, "create").mockResolvedValue(fakeRedemption as never);
      const createData: RedemptionCreateData = {
        userId: new Types.ObjectId(),
        rewardCost: 100,
        redemptionDate: new Date("2024-01-01T00:00:00.000Z"),
        twitchId: createFakeTwitch()._id,
        rewardId: createFakeReward()._id,
        userName: "username",
        userDisplayName: "User Display Name",
        rewardTitle: "Reward Title"
      };

      const result = await RedemptionsService.createRedemption(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeRedemption);
    });
  });

  describe("getMostActiveUsersByRedemptions", () => {
    it("should aggregate the most active users by redemption cost", async () => {
      const aggregateSpy = jest
        .spyOn(Redemption, "aggregate")
        .mockResolvedValue([{ _id: "user-1", username: "tester", redemptionsCount: 2, redemptionsCost: 200 }]);
      const startDate = new Date("2024-01-01T00:00:00.000Z");

      const result = await RedemptionsService.getMostActiveUsersByRedemptions(3, startDate);

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual([{ _id: "user-1", username: "tester", redemptionsCount: 2, redemptionsCost: 200 }]);
    });
  });
});
