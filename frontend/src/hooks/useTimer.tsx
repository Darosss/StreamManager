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
  const progressTimer = useRef<ReturnType<typeof setTimeout>>(null);
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
    if (progressTimer.current) clearInterval(progressTimer.current);
    if (!enabled) return;

    progressTimer.current = setInterval(() => {
      countTime(duration);
    }, updateMs);

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [duration, enabled]);

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [progressTimer]);
  return timer;
};
