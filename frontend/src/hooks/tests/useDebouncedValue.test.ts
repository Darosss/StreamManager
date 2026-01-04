import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebouncedValue } from "../useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should not update the value before the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("initial");
  });

  it("should update the value after the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");
  });

  it("should reset the timer if the value changes again within the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "first change" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: "second change" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("second change");
  });
});
