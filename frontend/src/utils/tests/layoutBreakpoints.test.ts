import { describe, it, expect } from "vitest";
import { getInitialCurrentBreakpoint } from "../layoutBreakpoints";

describe("getInitialCurrentBreakpoint", () => {
  const setWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it('should return "ulg" for widths 1700 and above', () => {
    setWidth(1800);
    expect(getInitialCurrentBreakpoint()).toBe("ulg");
  });

  it('should return "md" for widths between 996 and 1199', () => {
    setWidth(1000);
    expect(getInitialCurrentBreakpoint()).toBe("md");
  });

  it('should return "xxs" for very small screens', () => {
    setWidth(150);
    expect(getInitialCurrentBreakpoint()).toBe("xxs");
  });

  it('should return "xs" when exactly at the xs boundary', () => {
    setWidth(480);
    expect(getInitialCurrentBreakpoint()).toBe("xs");
  });
});
