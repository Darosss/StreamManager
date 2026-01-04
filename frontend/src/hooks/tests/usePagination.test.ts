import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePagination } from "../usePagination";

describe("usePagination", () => {
  it("should return the full range if total pages are less than the limit", () => {
    const { result } = renderHook(() => usePagination(30, 10, 1, 1));

    expect(result.current).toEqual([1, 2, 3]);
  });

  it("should show right dots when far from the end", () => {
    const { result } = renderHook(() => usePagination(100, 10, 1, 1));

    expect(result.current).toContain("...");
    expect(result.current![result.current!.length - 1]).toBe(10);
  });

  it("should show left dots when far from the start", () => {
    const { result } = renderHook(() => usePagination(100, 10, 1, 10));

    expect(result.current![0]).toBe(1);
    expect(result.current![1]).toBe("...");
  });

  it("should show dots on both sides when in the middle", () => {
    const { result } = renderHook(() => usePagination(100, 10, 1, 5));

    const pagination = result.current!;
    expect(pagination.filter((item) => item === "...")).toHaveLength(2);
  });

  it("should return empty array if totalCount is 0", () => {
    const { result } = renderHook(() => usePagination(0, 10, 1, 1));
    expect(result.current?.length).toBe(0);
  });

  it("should respect the siblingCount parameter", () => {
    const { result } = renderHook(() => usePagination(200, 10, 2, 10));

    expect(result.current).toContain(8);
    expect(result.current).toContain(12);
  });
});
