import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useMusicPlayer from "../useMusicPlayer";

describe("useMusicPlayer", () => {
  let mockSocket: any;
  let streamCallback: Function;
  let pauseCallback: Function;
  beforeEach(() => {
    mockSocket = {
      emits: {
        musicStop: vi.fn(),
        musicPlay: vi.fn(),
        musicNext: vi.fn(),
        changeVolume: vi.fn(),
        getAudioData: vi.fn((cb) =>
          cb({
            audioData: { name: "Initial Song", duration: 180 },
            isPlaying: true,
            songsInQue: [],
          })
        ),
      },
      events: {
        audioStreamData: {
          on: vi.fn((cb) => {
            streamCallback = cb;
          }),
          off: vi.fn(),
        },
        musicPause: {
          on: vi.fn((cb) => {
            pauseCallback = cb;
          }),
          off: vi.fn(),
        },
      },
    };
  });

  it("should call emitPlay when the play function is triggered", () => {
    const { result } = renderHook(() => useMusicPlayer(mockSocket));

    act(() => {
      result.current.emitPlay();
    });

    expect(mockSocket.emits.musicPlay).toHaveBeenCalled();
  });

  it("should setup event listeners on mount and cleanup on unmount", () => {
    const { unmount } = renderHook(() => useMusicPlayer(mockSocket));

    expect(mockSocket.events.audioStreamData.on).toHaveBeenCalled();
    expect(mockSocket.events.musicPause.on).toHaveBeenCalled();

    unmount();

    expect(mockSocket.events.audioStreamData.off).toHaveBeenCalled();
    expect(mockSocket.events.musicPause.off).toHaveBeenCalled();
  });

  it("should emit changeVolume when volume is updated", () => {
    const { result } = renderHook(() => useMusicPlayer(mockSocket));

    act(() => {
      result.current.emitChangeVolume(80);
    });

    expect(mockSocket.emits.changeVolume).toHaveBeenCalledWith(80);
  });
  it("should initialize state using getAudioData on mount", () => {
    const { result } = renderHook(() => useMusicPlayer(mockSocket));

    expect(mockSocket.emits.getAudioData).toHaveBeenCalled();

    expect(result.current.audioData.name).toBe("Initial Song");
    expect(result.current.isPlaying).toBe(true);
  });

  it("should update state when audioStreamData event fires", () => {
    const { result } = renderHook(() => useMusicPlayer(mockSocket));

    act(() => {
      streamCallback({
        audioData: { name: "New Streamed Song", duration: 200 },
        isPlaying: true,
        songsInQue: ["song2"],
      });
    });

    expect(result.current.audioData.name).toBe("New Streamed Song");
    expect(result.current.songsInQue).toContain("song2");
  });
  it("should reset audioData and set isPlaying to false when musicPause fires", () => {
    const { result } = renderHook(() => useMusicPlayer(mockSocket));

    act(() => {
      pauseCallback(false);
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.audioData.name).toBe("");
    expect(result.current.audioData.currentTime).toBe(0);
  });

  it("should clean up listeners when unmounted", () => {
    const { unmount } = renderHook(() => useMusicPlayer(mockSocket));

    unmount();

    expect(mockSocket.events.audioStreamData.off).toHaveBeenCalled();
    expect(mockSocket.events.musicPause.off).toHaveBeenCalled();
  });
});
