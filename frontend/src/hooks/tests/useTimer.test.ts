import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTimer } from "../useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not increment time when isPlaying is false", () => {
    const { result } = renderHook(() =>
      useTimer({ currentTime: 0, duration: 60, isPlaying: false })
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current).toBe(0);
  });

  it("should increment time when isPlaying is true", () => {
    const { result } = renderHook(() =>
      useTimer({ currentTime: 0, duration: 60, isPlaying: true })
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current).toBe(3);
  });

  it("should stop when reaching the duration", () => {
    const { result } = renderHook(() =>
      useTimer({ currentTime: 59, duration: 60, isPlaying: true })
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current).toBe(60);
  });
});
