import { Button } from "@components/ui/button";

interface SterringButtonsProps {
  playing: boolean;
  playFn: () => void;
  pauseFn: () => void;
  onNextSongFn: () => void;
}
export default function SterringButtons(props: SterringButtonsProps) {
  const { playing, playFn, pauseFn, onNextSongFn } = props;
  return (
    <div className="music-player-sterring-wrapper">
      <Button
        variant={playing ? "danger" : "primary"}
        onClick={() => (playing ? pauseFn() : playFn())}
      >
        {playing ? "PAUSE" : "PLAY"}
      </Button>
      <Button onClick={onNextSongFn}>NEXT &#8594;</Button>
    </div>
  );
}
