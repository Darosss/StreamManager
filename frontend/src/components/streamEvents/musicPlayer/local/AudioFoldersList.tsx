import { useEffect, useState } from "react";
import {
  DeleteMp3FileParams,
  useDeleteMp3File,
  useGetFolderMp3Files,
  useGetFoldersList,
  useRefetchFoldersFilesAudioData,
} from "@services";
import "./audio-folders-list.style.scss";
import { useSocketContext } from "@socket";
import { Loading } from "@components/axiosHelper";
import { Button } from "@components/ui/button";

export default function AudioFoldersList() {
  const socket = useSocketContext();
  const refetchFolderFilesAudioData = useRefetchFoldersFilesAudioData();
  const [folderName, setFolderName] = useState("");
  const { data: foldersData } = useGetFoldersList();

  const { data: mp3Data } = useGetFolderMp3Files(folderName);

  const deletMp3FileMutation = useDeleteMp3File();
  const handleDeleteMp3File = (data: DeleteMp3FileParams) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the mp3 file in folder: ${data.folderName} | named: ${data.fileName}?`
      )
    )
      return;
    deletMp3FileMutation.mutate(data);
  };

  const emitLoadSongs = () => {
    socket.emits.loadFolder(folderName);
  };

  const handleOnClickChangeFolder = (folder: string) => {
    setFolderName(folder);
  };

  useEffect(() => {
    if (!folderName) return;

    refetchFolderFilesAudioData(folderName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderName]);

  useEffect(() => {
    socket.emits.getAudioData((cb) => {
      if (!cb.audioData.downloadedData) return;
      setFolderName(cb.audioData.downloadedData.folderName);
    });
  }, [socket]);

  if (!foldersData) return <Loading />;

  const { data: folders } = foldersData;

  return (
    <div className="audio-files-list-wrapper">
      <div className="audio-folders-list-wrapper">
        {folders.map((folder, index) => {
          return (
            <Button
              key={index}
              onClick={() => handleOnClickChangeFolder(folder)}
              className={`common-button ${
                folder === folderName ? "primary-button" : "danger-button"
              }`}
            >
              {folder}
            </Button>
          );
        })}
      </div>
      {folderName ? (
        <Button
          onClick={() => {
            emitLoadSongs();
          }}
          className="load-folder-btn common-button primary-button"
        >
          Load {folderName}
        </Button>
      ) : null}
      <div className="mp3-files-wrapper">
        {mp3Data?.data.map((mp3, index) => {
          return (
            <div key={index} className="mp3-file list-with-x-buttons">
              <div>
                <Button
                  onClick={() =>
                    handleDeleteMp3File({ folderName, fileName: mp3 })
                  }
                  variant="danger"
                >
                  x
                </Button>
              </div>
              <div> {mp3} </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
