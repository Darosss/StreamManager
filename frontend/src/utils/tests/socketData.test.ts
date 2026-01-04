import { describe, it, expect } from "vitest";
import { getMessagesWithEmotes } from "../socketData";

describe("socketData", () => {
  describe("getMessagesWithEmotes", () => {
    it("should return undefined if no emotes are provided", () => {
      const result = getMessagesWithEmotes({
        message: "Hello world",
        emotes: null,
      });
      expect(result).toBeUndefined();
    });

    it("should correctly split a message with a single emote", () => {
      const message = "Hello Kappa world";
      const emotes = {
        emote_123: ["6-10"],
      };

      const result = getMessagesWithEmotes({ message, emotes });

      expect(result).toEqual([
        { value: "Hello " },
        { emoteId: "emote_123", value: "Kappa" },
        { value: " world" },
      ]);
    });

    it("should handle multiple emotes in order", () => {
      const message = "LUL Hello LUL";
      const emotes = {
        lul_id: ["0-2", "10-12"],
      };

      const result = getMessagesWithEmotes({ message, emotes });

      expect(result).toHaveLength(3);
      expect(result![0]).toEqual({ emoteId: "lul_id", value: "LUL" });
      expect(result![1]).toEqual({ value: " Hello " });
      expect(result![2]).toEqual({ emoteId: "lul_id", value: "LUL" });
    });

    it("should sort emotes by their start index even if the object keys are out of order", () => {
      const message = "First Second";
      const emotes = {
        second_id: ["6-11"],
        first_id: ["0-4"],
      };

      const result = getMessagesWithEmotes({ message, emotes });

      expect(result![0].value).toBe("First");
      expect(result![1].value).toBe(" ");
      expect(result![2].value).toBe("Second");
    });

    it("should handle emotes at the very end of a string", () => {
      const message = "Good job HeyGuys";
      const emotes = {
        heyguys_id: ["9-15"],
      };

      const result = getMessagesWithEmotes({ message, emotes });

      expect(result).toHaveLength(2);
      expect(result![1]).toEqual({ emoteId: "heyguys_id", value: "HeyGuys" });
    });

    it("should handle adjacent emotes with no text in between", () => {
      const message = "KappaLUL";
      const emotes = {
        kappa_id: ["0-4"],
        lul_id: ["5-7"],
      };

      const result = getMessagesWithEmotes({ message, emotes });

      expect(result).toEqual([
        { emoteId: "kappa_id", value: "Kappa" },
        { emoteId: "lul_id", value: "LUL" },
      ]);
    });
  });
});
