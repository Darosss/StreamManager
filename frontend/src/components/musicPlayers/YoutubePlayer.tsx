import { useSocketContext } from "@socket";
import { useCallback, useEffect, useRef } from "react";
import { viteBackendUrl } from "@configs/envVariables";

interface YoutubePlayerProps {
  songId: string;
  isPlaying: boolean;
}

export default function YoutubePlayer({
  songId,
  isPlaying,
}: YoutubePlayerProps) {
  const socket = useSocketContext();
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  const handleYTChangeVolume = useCallback(
    (volume: number) => {
      if (!audioPlayerRef || !audioPlayerRef.current) return;
      audioPlayerRef.current.volume = volume / 100;
    },
    [audioPlayerRef],
  );
  useEffect(() => {
    socket.events.changeVolume.on((volume) => {
      handleYTChangeVolume(volume);
    });

    return () => {
      socket.events.changeVolume.off();
    };
  }, [handleYTChangeVolume, socket]);

  return isPlaying ? (
    <audio
      ref={audioPlayerRef}
      src={`${viteBackendUrl}/music/youtube/${songId}.mp3`}
      autoPlay
    />
  ) : null;
}
