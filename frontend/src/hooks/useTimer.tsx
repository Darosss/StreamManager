import { useEffect, useRef, useState } from "react";

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
  const [timer, setTimer] = useState(0);

  const countTime = (newDuration: number) =>
    setTimer((prev) => {
      const newTime =
        prev + updateMs / 1000 > newDuration
          ? newDuration
          : prev + updateMs / 1000;
      return newTime;
    });

  useEffect(() => {
    setTimer(currentTime);

    // added duration for forcing setTimer (mostly duration will be different responsible for setting 'new' timer)
  }, [currentTime, duration]);

  useEffect(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (!enabled) return;

    progressTimerRef.current = setInterval(() => {
      countTime(duration);
    }, updateMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [duration, enabled]);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [progressTimerRef]);
  return timer;
};
