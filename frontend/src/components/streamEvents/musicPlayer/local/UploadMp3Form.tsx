import { useEffect, useState } from "react";
import { uploadMp3Data, useGetFoldersList } from "@services";
import "./upload-mp3-form-style.scss";
import { useFileUpload } from "@hooks";
import { Button } from "@components/ui/button";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";

export default function UploadMp3Form() {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [folderName, setFolderName] = useState("");

  const { addNotify } = useNotifications();
  const { data: foldersData } = useGetFoldersList();

  const { uploadProgress, handleFileUpload, error, success } = useFileUpload(
    uploadMp3Data.endpoint(folderName)
  );

  useEffect(() => {
    if (success)
      addNotify({
        title: "Uploaded files to server",
        message: success,
        type: NOTIFICATION_TYPE.SUCCESS,
      });
  }, [addNotify, success]);

  useEffect(() => {
    if (error)
      addNotify({
        title: "Couldn't upload files to server",
        message: error,
        type: NOTIFICATION_TYPE.DANGER,
      });
  }, [addNotify, error]);

  if (!foldersData) return <> No folders to upload </>;

  const { data: folders } = foldersData;

  return (
    <>
      <div className="upload-mp3-form-wrapper">
        <div className="upload-folder-buttons-wrapper">
          <div>Upload to:</div>
          <div className="upload-folder-buttons">
            {folders.map((folder, index) => {
              return (
                <Button
                  variant={folderName === folder ? "primary" : "danger"}
                  key={index}
                  onClick={() => setFolderName(folder)}
                >
                  {folder}
                </Button>
              );
            })}
          </div>
        </div>
        {folderName ? (
          <div className="upload-input-file">
            <input
              type="file"
              name="file"
              onChange={(e) => {
                setFileList(e.target.files);
                handleFileUpload({ event: e }, uploadMp3Data.uploadName);
              }}
              multiple
            />
            <div
              className="upload-mp3-progrees-bar"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        ) : null}

        <div className="upload-files-list">
          {fileList ? (
            <ul>
              {[...fileList].map((file, i) => (
                <li key={i}>
                  {file.name} - {file.type}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
}
