import { useCallback, useState } from "react";
import AudioFolderCreate from "./AudioFolderCreate";
import AudioFoldersList from "./AudioFoldersList";
import UploadMp3Form from "./UploadMp3Form";
import Modal from "@components/modal";
import { Button } from "@components/ui";

enum AvailableTabs {
  UPLOAD = "upload",
  MUSIC = "music",
  FOLDERS = "folders",
  NONE = "none",
}

export default function LocalMusicPlayer() {
  const [activeTab, setActiveTab] = useState<AvailableTabs>(AvailableTabs.NONE);

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case AvailableTabs.UPLOAD:
        return <UploadMp3Form />;
      case AvailableTabs.MUSIC:
        return <AudioFoldersList />;
      case AvailableTabs.FOLDERS:
        return <AudioFolderCreate />;
    }
  };

  const TabsButtons = () => (
    <>
      {Object.values(AvailableTabs)
        .filter((tab) => tab !== AvailableTabs.NONE)
        .map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "primary" : "tertiary"}
            className="switch-players-button"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
    </>
  );
  return (
    <div>
      <div className="music-player-tabs-wrapper">
        <TabsButtons />
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
