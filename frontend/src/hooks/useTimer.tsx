import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerProps {
  currentTime: number;
  duration: number;
  enabled: boolean;

  updateMs?: number;
}

export const useTimer = ({
  currentTime,
  duration,
  enabled,
  updateMs = 1000,
}: UseTimerProps) => {
  const progressTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [prevKey, setPrevKey] = useState<readonly [number, number]>([
    currentTime,
    duration,
  ]);
  const [timer, setTimer] = useState(currentTime);
  if (prevKey[0] !== currentTime || prevKey[1] !== duration) {
    setPrevKey([currentTime, duration]);
    setTimer(currentTime);
  }

  const countTime = useCallback(
    (newDuration: number) =>
      setTimer((prev) => {
        const newTime =
          prev + updateMs / 1000 > newDuration
            ? newDuration
            : prev + updateMs / 1000;
        return newTime;
      }),
    [updateMs],
  );

  useEffect(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (!enabled) return;

    progressTimerRef.current = setInterval(() => {
      countTime(duration);
    }, updateMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [duration, enabled, countTime, updateMs]);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [progressTimerRef]);
  return timer;
};
