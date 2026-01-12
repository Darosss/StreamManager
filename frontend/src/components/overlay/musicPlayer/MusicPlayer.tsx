import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSocketContext } from "@socket";
import { RootStore } from "@redux/store";
import useMusicPlayer from "@hooks/useMusicPlayer";
import { AudioStreamData } from "@socketTypes";
import { DownloadedSongPlayer, YoutubePlayer } from "@components/musicPlayers";
import RequestSongInfo from "./RequestSongInfo";
import SongPlayerTime from "./SongPlayerTime";

const editorTestData: AudioStreamData = {
  id: "djV11Xbc914",
  name: "a-ha - Take On Me",
  duration: 240,
  currentTime: 120,
  volume: 25,
  type: "yt",
};

export default function MusicPlayer() {
  const overlaysStateRedux = useSelector((state: RootStore) => state.overlays);
  const {
    isEditor,
    baseData: {
      styles: { overlayMusicPlayer: styles },
    },
  } = overlaysStateRedux;

  const [progress, setProgress] = useState(0);
  const socket = useSocketContext();
  const { audioData, isPlaying, songsInQue, setAudioData } =
    useMusicPlayer(socket);

  useEffect(() => {
    if (!isEditor || audioData.id) return;

    setAudioData(editorTestData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioData.id, isEditor]);
  const updateProgress = useCallback(
    (value: number) => {
      setProgress((value / audioData.duration) * 100);
    },
    [audioData.duration]
  );
  if (!isPlaying) return null;
  return (
    <div className="music-player">
      <RequestSongInfo
        isEditor={isEditor}
        styles={{
          ...styles.requests,
          opacity: styles.opacity,
        }}
      />

      <div className="music-player__card">
        <div
          className="music-player__bg"
          style={{
            borderRadius: styles.borderRadius,
            background: styles.background,
            boxShadow: styles.boxShadow,
            opacity: `${styles.opacity}%`,
          }}
        />
        <h2
          className="music-player__title"
          style={{
            color: styles.currentSong.color,
            fontSize: styles.currentSong.fontSize,
          }}
        >
          {audioData.name}
        </h2>

        <p
          className="music-player__requested-by"
          style={{
            color: styles.requests.nicknameColor,
          }}
        >
          {audioData.requester || "autoplay"}
        </p>

        <div className="music-player__progress">
          <div className="music-player__progress-track">
            <div
              className="music-player__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <SongPlayerTime
          isPlaying={audioData.duration > 0}
          currentTime={audioData.currentTime}
          duration={audioData.duration}
          onChangeTimer={updateProgress}
        />
      </div>
      {audioData.type === "yt" ? (
        <YoutubePlayer isPlaying={isPlaying} songId={audioData.id} />
      ) : audioData.downloadedData ? (
        <DownloadedSongPlayer
          data={{
            audioData,
            isPlaying,
            songsInQue,
          }}
        />
      ) : null}
    </div>
  );
}
