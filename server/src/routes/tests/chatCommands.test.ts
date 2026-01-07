import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { ChatCommand, Mood, Tag } from "@models";
import { beforeEach, describe, it, expect, afterAll, test, beforeAll } from "@jest/globals";
import { initMongoDataBase } from "@configs";
import { createTestTag, createTestTagAndMood } from "@tests";

const appInstance = app();
if (!process.env.TEST_DB_URL) throw new Error("Please, provide environment variable for TEST_DB_URL");

beforeAll(async () => {
  await initMongoDataBase(process.env.TEST_DB_URL!);
});

afterAll(async () => {
  await ChatCommand.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await ChatCommand.deleteMany({});
  await clearTagsAndMoodsTables();
});

const testCommandData = (tagId?: string, moodId?: string) => ({
  aliases: [],
  messages: ["test message1", "test message2"],
  name: "test chat command",
  privilege: 0,
  mood: moodId,
  tag: tagId
});

const clearTagsAndMoodsTables = async () => {
  await Tag.deleteMany({});
  await Mood.deleteMany({});
};

describe("Chat commands API", () => {
  describe("GET /chat-commands/", () => {
    it("should return empty commands array", async () => {
      const res = await request(appInstance).get("/chat-commands/");

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(0);
    });

    it("should return array of chat commands", async () => {
      const { tag, mood } = await createTestTagAndMood();

      const command = await ChatCommand.create(testCommandData(tag._id, mood._id));

      const res = await request(appInstance).get("/chat-commands/");

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0]._id).toEqual(command._id.toString());
      expect(res.body.data[0].messages).toEqual(expect.arrayContaining(command.messages));
    });
  });

  describe("POST /chat-commands/create", () => {
    it("should create new command", async () => {
      const { tag, mood } = await createTestTagAndMood();
      const commandData = testCommandData(tag._id, mood._id);
      const res = await request(appInstance).post("/chat-commands/create").send(commandData);

      expect(res.statusCode).toEqual(201);
      const foundCommand = await ChatCommand.findOne({});
      expect(foundCommand!.name).toBe(commandData.name);
    });
    it("should fail while creating without tag & mood body data", async () => {
      const commandData = testCommandData();
      const res = await request(appInstance).post("/chat-commands/create").send(commandData);

      expect(res.statusCode).toEqual(400);
    });
    it("should fail while creating without any body data", async () => {
      const res = await request(appInstance).post("/chat-commands/create").send();

      expect(res.statusCode).toEqual(400);
    });
  });

  describe("PATCH /chat-commands/:id - Successful Updates", () => {
    test.each([
      ["name", { name: "New name" }],
      ["description", { description: "New desc" }],
      ["enabled", { enabled: true }],
      ["messages", { messages: ["New message", "New message 2"] }],
      ["aliases", { aliases: ["alias1", "alias2"] }],
      ["privilege", { privilege: 5 }]
    ])("should update %s chat command correctly", async (category, payload) => {
      const { tag, mood } = await createTestTagAndMood();
      const command = await ChatCommand.create(testCommandData(tag._id, mood._id));

      const res = await request(appInstance).patch(`/chat-commands/${command._id}`).send(payload);

      expect(res.statusCode).toEqual(200);

      const rootKey = Object.keys(payload)[0] as keyof typeof payload;
      expect(res.body.data[rootKey]).toEqual(payload[rootKey]);
    });

    it("should update tag chat command correctly", async () => {
      const { tag, mood } = await createTestTagAndMood();
      const command = await ChatCommand.create(testCommandData(tag._id, mood._id));

      const newTag = await createTestTag("some other tag");
      const res = await request(appInstance).patch(`/chat-commands/${command._id}`).send({
        tag: newTag._id
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.tag).toEqual(newTag._id.toString());
    });
    it("should update mood chat command correctly", async () => {
      const { tag, mood } = await createTestTagAndMood();
      const command = await ChatCommand.create(testCommandData(tag._id, mood._id));

      const newMood = await createTestTag("some other mood");
      const res = await request(appInstance).patch(`/chat-commands/${command._id}`).send({
        mood: newMood._id
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.mood).toEqual(newMood._id.toString());
    });
  });

  describe("PATCH /chat-commands/:id - Failing Cases", () => {
    test.each([
      ["Empty name field", { name: "" }],
      ["Invalid Boolean", { enabled: "Y" }],
      ["Wrong type (String instead of an Array)", { messages: "something" }],
      ["Out of Range (Negative values)", { privilege: -1 }],
      ["Wrong Type (String instead of Number)", { privilege: "ONE" }]
    ])("should fail when sending %s", async (description, payload) => {
      const { tag, mood } = await createTestTagAndMood();
      const command = await ChatCommand.create(testCommandData(tag._id, mood._id));
      const res = await request(appInstance).patch(`/chat-commands/${command._id}`).send(payload);

      expect(res.error).toBeDefined();
      expect(res.error).toBeDefined();
      expect(res.error && res.error.status).toEqual(400);
    });

    it("should fail while editing with wrong provided id", async () => {
      const { tag, mood } = await createTestTagAndMood();
      const updatedName = "update name";
      await ChatCommand.create(testCommandData(tag._id, mood._id));
      const res = await request(appInstance).patch(`/chat-commands/123`).send({ name: updatedName });

      expect(res.statusCode).toEqual(400);
    });
    it("should fail while editing non existing command", async () => {
      const { tag, mood } = await createTestTagAndMood();
      const updatedName = "update name";
      await ChatCommand.create(testCommandData(tag._id, mood._id));
      const res = await request(appInstance)
        .patch(`/chat-commands/${new mongoose.Types.ObjectId()}`)
        .send({ name: updatedName });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe("DELETE /chat-commands/delete/:id", () => {
    it("should delete an existing command", async () => {
      const { tag, mood } = await createTestTagAndMood();
      const command = await ChatCommand.create(testCommandData(tag._id, mood._id));

      const res = await request(appInstance).delete(`/chat-commands/delete/${command._id}`);
      expect(res.statusCode).toEqual(200);
    });

    it("should fail while editing with wrong provided id", async () => {
      const res = await request(appInstance).delete(`/chat-commands/delete/123`);

      expect(res.statusCode).toEqual(400);
    });
    it("should fail while deleting non existing command", async () => {
      const res = await request(appInstance).delete(`/chat-commands/delete/${new mongoose.Types.ObjectId()}`);
      expect(res.statusCode).toEqual(404);
    });
  });
});
