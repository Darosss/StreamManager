import { useState } from "react";

import "./yt-playlist.style.scss";
import { useSocketContext } from "@socket";
import { Button } from "@components/ui";

export default function YTPlaylist() {
  const socket = useSocketContext();
  const [playlist, setPlaylist] = useState("");

  const emitLoadSongs = () => {
    if (!playlist) return;
    socket.emits.loadPlaylist(playlist);
  };

  return (
    <div className="yt-playlist-list-wrapper">
      <Button onClick={emitLoadSongs}>Load playlist</Button>
      <input type="text" onChange={(e) => setPlaylist(e.target.value)} />
    </div>
  );
}
