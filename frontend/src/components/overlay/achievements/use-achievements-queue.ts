import { viteBackendUrl } from "@configs";
import { SocketContexType } from "@socket";
import {
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
} from "@socketTypes";
import { useCallback, useEffect, useRef, useState } from "react";

type AchievementData = {
  audioUrl?: string;
  delay?: number;
};

type Options = {
  enabled: boolean;
  getAudioAndDelay: (
    data:
      | ObtainAchievementDataWithCollectedAchievement
      | ObtainAchievementDataWithProgressOnly,
  ) => AchievementData;
};

export const useAchievementQueue = (
  socket: SocketContexType | null,
  setObtainedAchievements: (
    cb: (
      prev: (
        | ObtainAchievementDataWithCollectedAchievement
        | ObtainAchievementDataWithProgressOnly
      )[],
    ) => (
      | ObtainAchievementDataWithCollectedAchievement
      | ObtainAchievementDataWithProgressOnly
    )[],
  ) => void,
  options: Options,
) => {
  const [start, setStart] = useState(() => new Date().getTime());
  const [end, setEnd] = useState(() => new Date().getTime() + 2500);
  const queueRef = useRef<
    (
      | ObtainAchievementDataWithCollectedAchievement
      | ObtainAchievementDataWithProgressOnly
    )[]
  >([]);
  const isProcessingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const processNext = useCallback(async () => {
    if (queueRef.current.length === 0 || isProcessingRef.current) return;
    isProcessingRef.current = true;

    const data = queueRef.current.shift();
    if (!data) {
      isProcessingRef.current = false;
      return;
    }
    setObtainedAchievements((prev) => [data, ...prev]);

    const { audioUrl, delay = 2500 } = options.getAudioAndDelay(data);
    const startTime = new Date().getTime();
    setStart(startTime);
    setEnd(startTime + delay);
    if (options.enabled && audioUrl) {
      const audio = new Audio(`${viteBackendUrl}/${audioUrl}`);
      audio.volume = 0.05;
      audioRef.current = audio;

      await audio.play();
    }

    setTimeout(() => {
      audioRef.current?.pause();

      isProcessingRef.current = false;
      processNext();
    }, delay);
  }, [options, setObtainedAchievements]);

  useEffect(() => {
    const handler = (
      data:
        | ObtainAchievementDataWithCollectedAchievement
        | ObtainAchievementDataWithProgressOnly,
    ) => {
      queueRef.current.push(data);

      processNext();
    };

    socket?.events?.obtainAchievement.on(handler);

    return () => {
      socket?.events?.obtainAchievement.off();
    };
  }, [socket?.events, options.enabled, processNext]);

  return { start, end, isActive: isProcessingRef.current };
};
