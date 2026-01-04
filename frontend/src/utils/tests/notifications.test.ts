import { describe, it, expect, vi, beforeEach } from "vitest";
import { Store } from "react-notifications-component";
import { addSuccessNotification, addErrorNotification } from "../notifications";
vi.mock(import("react-notifications-component"), () => {
  const Store = vi.fn({
    addNotification: vi.fn(),
  });
  return { Store };
});
describe("Notification Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call Store.addNotification with "Success" title', () => {
    addSuccessNotification("Operation finished");

    expect(Store.addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Success",
        message: "Operation finished",
        type: "success",
      })
    );
  });

  it("should set error notifications to last 30 seconds", () => {
    addErrorNotification("Something went wrong");

    expect(Store.addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "danger",
        dismiss: expect.objectContaining({
          duration: 30000,
        }),
      })
    );
  });
});
