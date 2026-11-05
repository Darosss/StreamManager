import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  Tag: {
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
  getAchievementsCount: jest.fn(),
  getChatCommandsCount: jest.fn(),
  getMessageCategoriesCount: jest.fn(),
  getTimersCount: jest.fn(),
  getTriggersCount: jest.fn()
}));

import { Tag, TagCreateData, TagModel } from "@models";
import {
  getAchievementsCount,
  getChatCommandsCount,
  getMessageCategoriesCount,
  getTimersCount,
  getTriggersCount
} from "@services";
import * as TagsService from "./tags";
import { Types } from "mongoose";

const createFakeTag = (): TagModel => ({
  _id: new Types.ObjectId(),
  name: "Test Tag",
  enabled: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

describe("Tags Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getTags", () => {
    it("should query tags with pagination and return the result", async () => {
      const fakeTags = [createFakeTag()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn<() => Promise<TagModel[]>>().mockResolvedValue(fakeTags)
      };

      const findSpy = jest.spyOn(Tag, "find").mockReturnValue(queryChain as never);

      const result = await TagsService.getTags({}, { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } });

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeTags);
    });
  });

  describe("getTagsCount", () => {
    it("should return the count of tags for a filter", async () => {
      const countSpy = jest.spyOn(Tag, "countDocuments").mockResolvedValue(3);

      const result = await TagsService.getTagsCount({ name: "Test Tag" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Test Tag" });
      expect(result).toBe(3);
    });
  });

  describe("createTag", () => {
    it("should create a tag and return it", async () => {
      const fakeTag = createFakeTag();
      const createSpy = jest.spyOn(Tag, "create").mockResolvedValue(fakeTag as never);
      const createData: TagCreateData = { name: fakeTag.name, enabled: fakeTag.enabled };

      const result = await TagsService.createTag(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeTag);
    });
  });

  describe("updateTags", () => {
    it("should update many tags with the given filter and data", async () => {
      const updateManySpy = jest.spyOn(Tag, "updateMany").mockResolvedValue({} as never);

      await TagsService.updateTags({ name: "Test Tag" }, { name: "Updated Tag" });

      expect(updateManySpy).toHaveBeenCalledWith({ name: "Test Tag" }, { name: "Updated Tag" });
    });
  });

  describe("updateTagById", () => {
    it("should update a tag and return it", async () => {
      const fakeTag = createFakeTag();
      const updateSpy = jest.spyOn(Tag, "findByIdAndUpdate").mockResolvedValue(fakeTag);

      const result = await TagsService.updateTagById(fakeTag._id, { name: "Updated Tag" });

      expect(updateSpy).toHaveBeenCalledWith(fakeTag._id, { name: "Updated Tag" }, { new: true });
      expect(result).toBe(fakeTag);
    });
  });

  describe("deleteTagById", () => {
    it("should delete a tag when it is not used elsewhere", async () => {
      const fakeTag = createFakeTag();
      const deleteSpy = jest.spyOn(Tag, "findByIdAndDelete").mockResolvedValue(fakeTag);
      jest.mocked(getTriggersCount).mockResolvedValue(0);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0);
      jest.mocked(getTimersCount).mockResolvedValue(0);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0);
      jest.mocked(getAchievementsCount).mockResolvedValue(0);

      const result = await TagsService.deleteTagById(fakeTag._id);

      expect(deleteSpy).toHaveBeenCalledWith(fakeTag._id);
      expect(result).toBe(fakeTag);
    });

    it("should throw when the tag is used by another document", async () => {
      jest.mocked(getTriggersCount).mockResolvedValue(1);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0);
      jest.mocked(getTimersCount).mockResolvedValue(0);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0);
      jest.mocked(getAchievementsCount).mockResolvedValue(0);

      await expect(TagsService.deleteTagById(new Types.ObjectId())).rejects.toThrow();
    });
  });

  describe("getTagById", () => {
    it("should return a tag when one exists", async () => {
      const fakeTag = createFakeTag();
      const findByIdSpy = jest.spyOn(Tag, "findById").mockResolvedValue(fakeTag);

      const result = await TagsService.getTagById(fakeTag._id, { name: 1 });

      expect(findByIdSpy).toHaveBeenCalledWith(fakeTag._id, { name: 1 });
      expect(result).toBe(fakeTag);
    });
  });

  describe("getOneTag", () => {
    it("should return the first matching tag", async () => {
      const fakeTag = createFakeTag();
      jest.spyOn(Tag, "findOne").mockResolvedValue(fakeTag as never);

      const result = await TagsService.getOneTag({ name: "Test Tag" });

      expect(result).toBe(fakeTag);
    });
  });
});
