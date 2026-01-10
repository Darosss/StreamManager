import { useSocketContext } from "@socket";
import { RequestSongData } from "@socketTypes";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { OverlayRequestsStyle } from "src/layout/overlays/types";

interface RequestSongInfoProps {
  isEditor: boolean;
  styles: OverlayRequestsStyle & { opacity: number };
}

const SHOW_REQUEST_MS = 4000;

const HIDE_REQUEST_AFTER_MS = 2500;

export default function RequestSongInfo({
  isEditor,
  styles,
}: RequestSongInfoProps) {
  const [requestedSongs, setRequestedSongs] = useState<RequestSongData[]>([]);
  const [showRequest, setShowRequest] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<RequestSongData | null>(
    null
  );

  const showRequestsTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const {
    color,
    boxShadow,
    headerFontSize,
    nicknameColor,
    fontSize,
    background,
    opacity,
  } = styles;
  const socket = useSocketContext();

  function addRequestedSong(songName: string, username: string) {
    setRequestedSongs((prevState) => [{ songName, username }, ...prevState]);
  }

  useEffect(() => {
    if (!isEditor) return;
    const requestInterval = setInterval(() => {
      addRequestedSong(
        `Random song ${dayjs().format("HH:mm:ss")}`,
        `random username ${dayjs().format("HH:mm:ss")}`
      );
    }, 7000);
    return () => {
      clearInterval(requestInterval);
    };
  }, [isEditor]);

  useEffect(() => {
    socket.events.requestSong.on((data) => {
      addRequestedSong(data.songName, data.username);
    });

    return () => {
      socket.events.requestSong.off();
    };
  }, [socket]);

  useEffect(() => {
    if (showRequestsTimeout.current || requestedSongs.length === 0) return;

    showRequestsTimeout.current = setInterval(() => {
      setRequestedSongs((prevState) => {
        if (prevState.length === 0) return prevState;

        const firstItem = prevState.at(0)!;
        setCurrentRequest(firstItem);
        setShowRequest(true);

        return prevState.slice(1);
      });
    }, SHOW_REQUEST_MS);
  }, [requestedSongs]);

  useEffect(() => {
    if (!showRequest) return;

    const timeout = setTimeout(() => {
      setShowRequest(false);
    }, HIDE_REQUEST_AFTER_MS);
    return () => {
      setShowRequest(false);
      clearTimeout(timeout);
    };
  }, [showRequest]);
  return (
    <div
      className={`music-player__request-popup ${
        showRequest
          ? "music-player__request-popup--visible"
          : "music-player__request-popup--hidden"
      }`}
    >
      <div className="music-player__request-card">
        <div className="music-player__request-icon" style={{ background }}>
          🎶
        </div>
        <div className="music-player__request-content">
          <p
            className="music-player__request-label"
            style={{ fontSize: headerFontSize }}
          >
            New Request
          </p>
          <p
            className="music-player__request-title"
            style={{
              color,
              fontSize,
            }}
          >
            {currentRequest?.songName}
          </p>
          <p
            className="music-player__request-user"
            style={{
              color: nicknameColor,
              fontSize: fontSize,
            }}
          >
            by {currentRequest?.username}
          </p>
        </div>
        <div
          className="music-player__request-bg"
          style={{ background, boxShadow, opacity: `${opacity}%` }}
        />
      </div>
    </div>
  );
}
