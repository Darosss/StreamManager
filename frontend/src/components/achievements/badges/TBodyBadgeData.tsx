import { DateTooltip } from "@components/dateTooltip";
import { viteBackendUrl } from "@configs/envVariables";
import { useDispatch } from "react-redux";
import { openModal, setBadgeState, setEditingId } from "@redux/badgesSlice";
import { Badge, useDeleteBadge } from "@services";
import { Button } from "@components/ui/button";

interface TBodyManyBadgesDataProps {
  badges: Badge[];
}

export default function TBodyManyBadgesData({
  badges,
}: TBodyManyBadgesDataProps) {
  const dispatch = useDispatch();
  const deleteBadgeMutation = useDeleteBadge();

  const handleDeleteBadge = (id: string) => {
    if (
      !window.confirm(`Are you sure you want to delete the badge with: ${id}?`)
    )
      return;
    deleteBadgeMutation.mutate(id);
  };
  return (
    <>
      {badges?.map((badge, index) => {
        return (
          <tr key={index} className="badges-list-data-tbody">
            <td>
              <div className="badge-data-table-actions">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setEditingId(badge._id));
                    dispatch(setBadgeState(badge));
                    dispatch(openModal());
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBadge(badge._id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </td>
            <td>{badge.name}</td>
            <td>
              <div className="badge-image-wrapper">
                <div>{badge.imagesUrls.x128}</div>
                <img
                  src={`${viteBackendUrl}/${badge.imagesUrls.x128}`}
                  alt={badge.imagesUrls.x128}
                />
              </div>
            </td>
            <td>{badge.description}</td>

            <td className="badge-table-data">
              <DateTooltip date={badge.createdAt} />
            </td>
            <td className="badge-table-data">
              <DateTooltip date={badge.updatedAt} />
            </td>
          </tr>
        );
      })}
    </>
  );
}
