import { useEffect, useState } from "react";
import { useFileUpload } from "@hooks";
import {
  GetBagesImagesResponseData,
  uploadBadgesData,
  useGetBadgesIamgesBasePath,
  useRefetchBadgeData,
} from "@services";
import { viteBackendUrl } from "@configs/envVariables";
import { OnClickBadgeType } from "./types";
import { Button } from "@components/ui";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";

interface AvailableBadgeImagesProps {
  badgesData: GetBagesImagesResponseData;
  onClickBadge: ({ badgeName, badgeExtension }: OnClickBadgeType) => void;
  currentImgPath?: string;
  className?: string;
  showNames?: boolean;
}

export default function AvailableBadgeImages({
  badgesData,
  onClickBadge,
  currentImgPath,
  className,
  showNames,
}: AvailableBadgeImagesProps) {
  const refetchBadges = useRefetchBadgeData();
  const { data: basePathData } = useGetBadgesIamgesBasePath();
  const [filterBadgesNames, setFilterBadgesNames] = useState("");

  if (!basePathData) return <> No base path data. </>;

  return (
    <div className={`available-badge-images-wrapper ${className}`}>
      <div>{currentImgPath}</div>

      <div className="action-items-wrapper">
        <UploadBadgeImageButtons onSuccessCallback={refetchBadges} />
        <Button variant="tertiary" onClick={refetchBadges}>
          Refresh
        </Button>
        <input
          type="text"
          placeholder="search"
          onChange={(e) => setFilterBadgesNames(e.target.value.toLowerCase())}
        />
      </div>
      <div className="badge-images-list-wrapper">
        {badgesData.imagesPaths
          .filter(([name]) => {
            if (!filterBadgesNames) return true;
            if (name.toLowerCase().includes(filterBadgesNames)) return true;
            return false;
          })
          .map(([name, extension], index) => (
            <div
              key={index}
              className="one-badge-image-wrapper"
              onClick={() =>
                onClickBadge({
                  badgeName: name,
                  badgeExtension: extension,
                  basePath: basePathData.data,
                })
              }
            >
              {showNames ? (
                <div className="badge-name">{name}</div>
              ) : (
                <div className="image-name-tooltip">{name}</div>
              )}
              <img
                src={`${viteBackendUrl}/${basePathData.data}\\${name}${extension}`}
                className={`${
                  currentImgPath?.includes(name) ? "current-image" : ""
                }`}
                alt={name}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

interface UploadBadgeImageButtonsProps {
  onSuccessCallback: () => void;
}
//TODO: there is similar UploadAchievementStageSoundButtons - merge them maybe later
function UploadBadgeImageButtons({
  onSuccessCallback,
}: UploadBadgeImageButtonsProps) {
  const [showUploadImages, setShowUploadImages] = useState(false);

  const { addNotify } = useNotifications();
  const { uploadProgress, handleFileUpload, error, success } = useFileUpload(
    uploadBadgesData.badgesImages
  );

  useEffect(() => {
    if (success) {
      addNotify({
        title: "Uploaded badge image",
        message: success,
        type: NOTIFICATION_TYPE.SUCCESS,
      });
      onSuccessCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    if (error) addNotify({ title: error, type: NOTIFICATION_TYPE.DANGER });
  }, [addNotify, error]);

  return (
    <>
      <Button onClick={() => setShowUploadImages(!showUploadImages)}>
        {showUploadImages ? "Hide upload" : "New"}
      </Button>

      {showUploadImages ? (
        <div className="upload-badge-image-content">
          <div>Upload</div>
          <div>
            <input
              type="file"
              name="file"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              onChange={(e) => handleFileUpload({ event: e }, "uploaded_file")}
              multiple
            />
            <div
              className="upload-badge-image-progress"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
