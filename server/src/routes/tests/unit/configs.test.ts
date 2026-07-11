/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import { describe, expect, jest, it, beforeEach } from "@jest/globals";
import * as ConfigController from "../../../controllers/configs";
import express from "express";
import configsRouter from "../../configs";

const app = express();

app.use(express.json());
app.use("/configs", configsRouter);

jest.mock("../../../controllers/configs");

describe("Configs Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /configs", () => {
    it("should call getConfigs controller", async () => {
      jest.spyOn(ConfigController, "getConfigsList").mockImplementation(async (_req, res) => {
        res.status(200).json({ data: [] });
      });

      await request(app).get("/configs");

      expect(ConfigController.getConfigsList).toHaveBeenCalledTimes(1);
    });
  });

  describe("PATCH /configs/edit", () => {
    it("should call editConfigs controller", async () => {
      jest.spyOn(ConfigController, "editConfigs").mockImplementation(async (_req, res) => {
        res.status(200).json({ data: {} });
      });

      await request(app)
        .patch("/configs/edit")
        .send({
          commandsConfigs: {
            commandsPrefix: "&&"
          }
        });

      expect(ConfigController.editConfigs).toHaveBeenCalledTimes(1);
    });
  });
});
