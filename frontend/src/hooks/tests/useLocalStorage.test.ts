import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();

    vi.spyOn(Storage.prototype, "setItem");
    vi.spyOn(Storage.prototype, "getItem");
  });

  it("should return initialValue if localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("default");
  });

  it("should return existing value from localStorage if present", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when setValue is called", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      const setValue = result.current[1];
      setValue("new-value");
    });

    expect(result.current[0]).toBe("new-value");

    expect(window.localStorage.getItem("test-key")).toBe(
      JSON.stringify("new-value")
    );
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("new-value")
    );
  });

  it("should handle complex objects", () => {
    const user = { name: "Bob", age: 30 };
    const { result } = renderHook(() => useLocalStorage("user-key", user));

    act(() => {
      result.current[1]({ name: "Alice", age: 25 });
    });

    const storedValue = JSON.parse(
      window.localStorage.getItem("user-key") || ""
    );
    expect(storedValue.name).toBe("Alice");
  });

  it("should work with functional updates (like useState)", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));

    act(() => {
      const setValue = result.current[1];

      setValue((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(window.localStorage.getItem("count")).toBe("1");
  });
});
