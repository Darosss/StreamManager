import { useState } from "react";
import YTPlaylist from "./YTPlaylist";
import Modal from "@components/modal";
import TabsButtons from "../TabsButtons";

enum AvailableTabs {
  PLAYLISTS = "playlists",
  NONE = "none",
}

export default function YTMusicPlayer() {
  const [activeTab, setActiveTab] = useState<AvailableTabs>(AvailableTabs.NONE);

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case AvailableTabs.PLAYLISTS:
        return <YTPlaylist />;
    }
  };

  return (
    <div>
      <div className="music-player-tabs-wrapper">
        <TabsButtons
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          possibleTabs={AvailableTabs}
        />
      </div>
      <Modal
        title={activeTab}
        onClose={() => setActiveTab(AvailableTabs.NONE)}
        onSubmit={() => setActiveTab(AvailableTabs.NONE)}
        show={activeTab !== AvailableTabs.NONE}
      >
        {generateMusicPlayerContext()}
      </Modal>
    </div>
  );
}
