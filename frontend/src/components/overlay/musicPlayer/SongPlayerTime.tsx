import { useTimer } from "@hooks/useTimer";
import { useEffect } from "react";

interface SongPlayerTimeProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onChangeTimer: (value: number) => void;
}
export default function SongPlayerTime({
  currentTime,
  duration,
  isPlaying,
  onChangeTimer,
}: SongPlayerTimeProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(0).toString().padStart(2, "0")}`;
  };
  const timer = useTimer({
    currentTime,
    duration,
    isPlaying,
  });

  useEffect(() => {
    onChangeTimer(timer);
  }, [onChangeTimer, timer]);
  return (
    <div className="music-player__time">
      <span>{formatTime(timer)}</span>
      <span>{formatTime(duration)}</span>
    </div>
  );
}
