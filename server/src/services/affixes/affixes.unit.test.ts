import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  Affix: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn()
  }
}));

jest.mock("@services", () => ({
  getChatCommandsCount: jest.fn(),
  getMessageCategoriesCount: jest.fn(),
  getTimersCount: jest.fn(),
  getTriggersCount: jest.fn()
}));

import { Affix, AffixModel } from "@models";
import { getChatCommandsCount, getMessageCategoriesCount, getTimersCount, getTriggersCount } from "@services";
import * as AffixesService from "./affixes";
import { Types } from "mongoose";

const createFakeAffix = (): AffixModel => ({
  _id: new Types.ObjectId(),
  name: "Test Affix",
  enabled: true,
  prefixes: ["pre"],
  suffixes: ["suf"],
  prefixChance: 20,
  suffixChance: 30,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Affixes Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAffixes", () => {
    it("should query affixes with pagination and return the result", async () => {
      const fakeAffixes = [createFakeAffix()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn<() => Promise<AffixModel[]>>().mockResolvedValue(fakeAffixes)
      };

      const findSpy = jest.spyOn(Affix, "find").mockReturnValue(queryChain as never);

      const result = await AffixesService.getAffixes(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeAffixes);
    });
  });

  describe("getAffixesCount", () => {
    it("should return the count of affixes for a filter", async () => {
      const countSpy = jest.spyOn(Affix, "countDocuments").mockResolvedValue(4);

      const result = await AffixesService.getAffixesCount({ enabled: true });

      expect(countSpy).toHaveBeenCalledWith({ enabled: true });
      expect(result).toBe(4);
    });
  });

  describe("createAffix", () => {
    it("should create an affix and return it", async () => {
      const fakeAffix = createFakeAffix();
      const createSpy = jest.spyOn(Affix, "create").mockResolvedValue(fakeAffix as never);
      const createData = { name: "Test Affix", enabled: true, prefixes: ["pre"], suffixes: ["suf"] };

      const result = await AffixesService.createAffix(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeAffix);
    });
  });

  describe("updateAffixes", () => {
    it("should update many affixes with the given filter and data", async () => {
      const updateManySpy = jest.spyOn(Affix, "updateMany").mockResolvedValue({} as never);

      await AffixesService.updateAffixes({ enabled: true }, { enabled: false });

      expect(updateManySpy).toHaveBeenCalledWith({ enabled: true }, { enabled: false });
    });
  });

  describe("updateAffixById", () => {
    it("should update an affix and return it", async () => {
      const fakeAffix = createFakeAffix();
      const updateSpy = jest.spyOn(Affix, "findByIdAndUpdate").mockResolvedValue(fakeAffix);

      const result = await AffixesService.updateAffixById(fakeAffix._id, { enabled: false });

      expect(updateSpy).toHaveBeenCalledWith(fakeAffix._id, { enabled: false }, { new: true });
      expect(result).toBe(fakeAffix);
    });
  });

  describe("deleteAffixById", () => {
    it("should delete an affix when it is not used elsewhere", async () => {
      const fakeAffix = createFakeAffix();
      const deleteSpy = jest.spyOn(Affix, "findByIdAndDelete").mockResolvedValue(fakeAffix);
      jest.mocked(getTriggersCount).mockResolvedValue(0);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0);
      jest.mocked(getTimersCount).mockResolvedValue(0);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0);

      const result = await AffixesService.deleteAffixById(fakeAffix._id);

      expect(deleteSpy).toHaveBeenCalledWith(fakeAffix._id);
      expect(result).toBe(fakeAffix);
    });

    it("should throw when the affix is used by another document", async () => {
      jest.mocked(getTriggersCount).mockResolvedValue(1);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0);
      jest.mocked(getTimersCount).mockResolvedValue(0);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0);

      await expect(AffixesService.deleteAffixById(new Types.ObjectId())).rejects.toThrow();
    });
  });

  describe("getAffixById", () => {
    it("should return an affix when one exists", async () => {
      const fakeAffix = createFakeAffix();
      const findByIdSpy = jest.spyOn(Affix, "findById").mockResolvedValue(fakeAffix);
      const affixId = new Types.ObjectId();
      const result = await AffixesService.getAffixById(affixId, { enabled: 1 });

      expect(findByIdSpy).toHaveBeenCalledWith(affixId, { enabled: 1 });
      expect(result).toBe(fakeAffix);
    });
  });

  describe("getOneAffix", () => {
    it("should return the first matching affix", async () => {
      const fakeAffix = createFakeAffix();
      jest.spyOn(Affix, "findOne").mockResolvedValue(fakeAffix as never);

      const result = await AffixesService.getOneAffix({ enabled: true });

      expect(result).toBe(fakeAffix);
    });
  });

  describe("getEnabledSuffixesAndPrefixes", () => {
    it("should aggregate and deduplicate enabled suffixes and prefixes", async () => {
      const aggregateSpy = jest
        .spyOn(Affix, "aggregate")
        .mockResolvedValue([{ prefixes: [["pre1", "pre2"]], suffixes: [["suf1", "suf2"]] }]);

      const result = await AffixesService.getEnabledSuffixesAndPrefixes();

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual({ prefixes: ["pre1", "pre2"], suffixes: ["suf1", "suf2"] });
    });
  });

  describe("getMultiperEnabledAfixesChances", () => {
    it("should aggregate multiplier values for enabled affixes", async () => {
      const aggregateSpy = jest
        .spyOn(Affix, "aggregate")
        .mockResolvedValue([{ prefixesMultipler: 200, suffixesMultipler: 300 }]);

      const result = await AffixesService.getMultiperEnabledAfixesChances();

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual({ prefixesMultipler: 2, suffixesMultipler: 3 });
    });
  });

  describe("getAverageEnabledAffixesChances", () => {
    it("should aggregate average chances for enabled affixes", async () => {
      const aggregateSpy = jest
        .spyOn(Affix, "aggregate")
        .mockResolvedValue([{ prefixesChances: 20, suffixesChances: 30 }]);

      const result = await AffixesService.getAverageEnabledAffixesChances();

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual({ prefixesChances: 20, suffixesChances: 30 });
    });
  });
});
