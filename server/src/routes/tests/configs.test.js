import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Config } from "@models";
import { beforeEach, describe, it, expect, afterAll, test } from "@jest/globals";
import { initMongoDataBase } from "@configs";

const appInstance = app();

beforeAll(async () => {
  await initMongoDataBase(process.env.TEST_DB_URL);
});

afterAll(async () => {
  await Config.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Config.deleteMany({});
});

describe("Configs API", () => {
  describe("GET /configs/", () => {
    it("should return all configs", async () => {
      const res = await request(appInstance).get("/configs/");

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeDefined();
    });

    it("should recreate configs and return them", async () => {
      await Config.deleteMany({});
      const res = await request(appInstance).get("/configs/");

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe("PATCH /configs/edit", () => {
    it("should upsert new config and edit commands prefix to &&", async () => {
      await Config.deleteMany({});
      const res = await request(appInstance)
        .patch("/configs/edit")
        .send({
          commandsConfigs: { commandsPrefix: "&&" }
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.commandsConfigs.commandsPrefix).toBe("&&");
    });

    describe("PATCH /configs/edit - Successful Updates", () => {
      test.each([
        ["Commands", { commandsConfigs: { commandsPrefix: "&&" } }],
        ["Timers", { timersConfigs: { nonFollowTimerPoints: 50, timersIntervalDelay: 60000 } }],
        ["Triggers", { triggersConfigs: { randomMessageChance: 25 } }],
        ["Points", { pointsConfigs: { pointsIncrement: { watch: 20, message: 10, watchMultipler: 1.5 } } }],
        ["Loyalty", { loyaltyConfigs: { intervalCheckChatters: 10000 } }],
        ["ChatGames", { chatGamesConfigs: { minActiveUsersThreshold: 10 } }],
        ["Music", { musicConfigs: { songRequest: true, maxAutoQueSize: 10 } }],
        ["Head/Global", { headConfigs: { intervalCheckViewersPeek: 10000 } }]
      ])("should update %s configuration correctly", async (category, payload) => {
        const res = await request(appInstance).patch("/configs/edit").send(payload);

        expect(res.statusCode).toEqual(200);

        const rootKey = Object.keys(payload)[0];
        const subKey = Object.keys(payload[rootKey])[0];

        expect(res.body.data[rootKey][subKey]).toEqual(payload[rootKey][subKey]);
      });
    });
    describe("PATCH /configs/edit - Failing Cases", () => {
      test.each([
        ["Wrong Type (String instead of Number)", { timersConfigs: { nonFollowTimerPoints: "TEN" } }],
        ["Out of Range (Negative values)", { chatGamesConfigs: { minActiveUsersThreshold: -5 } }],
        [
          "Invalid Boolean",
          { musicConfigs: { songRequest: "Y" } } //
        ],
        ["Malformed Nested Object", { headConfigs: { permissionLevels: "invalid" } }]
      ])("should fail when sending %s", async (description, payload) => {
        const res = await request(appInstance).patch("/configs/edit").send(payload);

        expect(res.error).toBeDefined();
        expect(res.error.status).toEqual(400);
      });
    });
  });

  describe("POST /configs/defaults", () => {
    it("should reset configs to defaults", async () => {
      const res = await request(appInstance).post("/configs/defaults");

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeDefined();
    });
  });
});
