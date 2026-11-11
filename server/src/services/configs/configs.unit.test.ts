import { describe, expect, jest, it, beforeEach, afterEach } from "@jest/globals";
import * as ConfigsService from "./configs";
import { Config, ConfigModel, ConfigUpdateData } from "../../models/configs";
import { configDefaults } from "../../defaults/configsDefaults";
import { Error, Types } from "mongoose";

describe("Configs Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getConfigs", () => {
    it("should get current configs and not call createNewConfig", async () => {
      const createNewConfigSpy = jest.spyOn(ConfigsService, "createNewConfig");
      jest.spyOn(Config, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValue(configDefaults as never)
      } as never);
      const result = await ConfigsService.getConfigs();

      expect(createNewConfigSpy).toHaveBeenCalledTimes(0);

      expect(result).toBe(configDefaults);
    });
    it("should call createNewConfig and return configs", async () => {
      const createNewConfigSpy = jest.spyOn(ConfigsService, "createNewConfig");
      jest.spyOn(Config, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValue(undefined as never)
      } as never);
      jest.spyOn(Config, "create").mockReturnValue(configDefaults as never);
      const result = await ConfigsService.getConfigs();

      expect(createNewConfigSpy).toHaveBeenCalledTimes(1);

      expect(result).toBe(configDefaults);
    });
    it("should propagate the raw database error when Config.findOne throws", async () => {
      const dbError = new Error("Database connection lost");
      jest.spyOn(Config, "findOne").mockImplementation(() => {
        throw dbError;
      });
      await expect(ConfigsService.getConfigs()).rejects.toThrow();
    });
  });
  describe("createNewConfig", () => {
    it("should save new default configs to the database and return them", async () => {
      const dbSaveSpy = jest.spyOn(Config, "create").mockResolvedValue(configDefaults as never);

      const result = await ConfigsService.createNewConfig();

      expect(dbSaveSpy).toHaveBeenCalledTimes(1);

      expect(result).toBe(configDefaults);

      dbSaveSpy.mockRestore();
    });
    it("should propagate the raw database error when Config.create throws", async () => {
      const dbError = new Error("Database connection lost");
      jest.spyOn(Config, "create").mockImplementation(() => {
        throw dbError;
      });
      await expect(ConfigsService.createNewConfig()).rejects.toThrow();
    });
  });
  describe("updateConfigs", () => {
    it("should save new default configs to the database and return them", async () => {
      const dbSaveSpy = jest.spyOn(Config, "create").mockResolvedValue(configDefaults as never);

      const result = await ConfigsService.createNewConfig();

      expect(dbSaveSpy).toHaveBeenCalledTimes(1);

      expect(result).toBe(configDefaults);

      dbSaveSpy.mockRestore();
    });
    it("should propagate the raw database error when Config.create throws", async () => {
      const dbError = new Error("Database connection lost");
      jest.spyOn(Config, "create").mockImplementation(() => {
        throw dbError;
      });
      await expect(ConfigsService.createNewConfig()).rejects.toThrow();
    });
  });
  describe("updateConfigs", () => {
    it("should successfully update configs and return the updated document", async () => {
      const fakeUpdateData: ConfigUpdateData = {
        commandsConfigs: {
          commandsPrefix: "!"
        }
      };
      // cause - the updateConfigs should flattenObject update
      const expectedFlattened = { "commandsConfigs.commandsPrefix": "!" };

      const fakeUpdatedDoc: ConfigModel = {
        _id: new Types.ObjectId(),
        ...configDefaults,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const dbSpy = jest.spyOn(Config, "findOneAndUpdate").mockResolvedValue(fakeUpdatedDoc);

      const result = await ConfigsService.updateConfigs(fakeUpdateData);

      expect(dbSpy).toHaveBeenCalledTimes(1);
      expect(dbSpy).toHaveBeenCalledWith({}, expectedFlattened, { new: true, upsert: true });
      expect(result).toBe(fakeUpdatedDoc);
    });

    it("should log the error and trigger handleAppError when the database throws", async () => {
      const fakeUpdateData: ConfigUpdateData = {
        commandsConfigs: {
          commandsPrefix: "!"
        }
      };
      const dbError = new Error("Database connection lost");

      jest.spyOn(Config, "findOneAndUpdate").mockRejectedValue(dbError);

      await expect(ConfigsService.updateConfigs(fakeUpdateData)).rejects.toThrow();
    });
  });
});
