import { describe, it, expect } from "vitest";
import { convertSecondsToMS, getDateFromSecondsToYMDHMS } from "../dateUtils";

describe("dateUtils", () => {
  describe("convertSecondsToMS", () => {
    it("should correctly format seconds into [minutes, seconds]", () => {
      const result = convertSecondsToMS(90);
      expect(result).toEqual([1, "30"]);
    });

    it("should pad single digit seconds with a zero", () => {
      const result = convertSecondsToMS(65);
      expect(result).toEqual([1, "05"]);
    });

    it("should handle exactly 0 seconds", () => {
      const result = convertSecondsToMS(0);
      expect(result).toEqual([0, "00"]);
    });

    it("should handle large durations (hours become minutes)", () => {
      const result = convertSecondsToMS(3665);
      expect(result).toEqual([61, "05"]);
    });
  });

  describe("getDateFromSecondsToYMDHMS", () => {
    it("should format simple hours, minutes, and seconds", () => {
      const result = getDateFromSecondsToYMDHMS(3661);
      expect(result).toBe("1h 1m 1s");
    });

    it("should skip units that are zero", () => {
      const result = getDateFromSecondsToYMDHMS(3600);
      expect(result).toBe("1h ");
    });

    it("should respect the custom separator", () => {
      const result = getDateFromSecondsToYMDHMS(3661, ", ");
      expect(result).toBe("1h, 1m, 1s");
    });

    it("should return empty string for 0 seconds (if that is intended)", () => {
      const result = getDateFromSecondsToYMDHMS(0);
      expect(result).toBe("");
    });

    it("should handle days", () => {
      const result = getDateFromSecondsToYMDHMS(90000);
      expect(result).toBe("1d 1h ");
    });
  });
});
