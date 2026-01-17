import NavigateButton from "@components/navigateButton";

import {
  Achievement,
  fetchAchievementsDefaultParams,
  useDeleteCustomAchievement,
  useGetAchievements,
} from "@services";
import { Error } from "@components/axiosHelper";
import EditCreateAchievementModal from "./EditCreateAchievementModal";
import { useQueryParams } from "@hooks/useQueryParams";
import Filter, {
  getPossibleCommonField,
  Options,
} from "@components/filter/Filter";
import { AchievementCard, AchievementCardSkeleton } from "./AchievementCard";
import Pagination from "@components/pagination";
import { useDispatch } from "react-redux";
import {
  AchievementSliceType,
  ManageAchievementsCurrentAction,
  openModal,
  setAchievementState,
  setCurrentAction,
  setEditingId,
} from "@redux/achievementsSlice";
import { CreateCustomAchievementButton } from "./CreateCustomAchievementButton";
import SortBy, { SortByOptions } from "@components/sortBy";

const getAchievementsStateDataHelper = (
  achievement: Achievement
): AchievementSliceType["achievement"] => {
  return {
    ...achievement,
    tag: achievement.tag._id,
    stages: achievement.stages._id,
  };
};
export default function AchievementsList() {
  const dispatch = useDispatch();
  const queryParams = useQueryParams(fetchAchievementsDefaultParams);
  const {
    data: achievementsData,
    isLoading,
    error,
    refetch,
  } = useGetAchievements(queryParams);
  const deleteCustomAchievementMutate = useDeleteCustomAchievement();

  const handleEdit = (achievement: Achievement) => {
    dispatch(setEditingId(achievement._id));
    dispatch(
      setCurrentAction(
        achievement.custom
          ? ManageAchievementsCurrentAction.EDIT_CUSTOM
          : ManageAchievementsCurrentAction.EDIT
      )
    );
    dispatch(setAchievementState(getAchievementsStateDataHelper(achievement)));
    dispatch({ type: "SET_STATE", payload: achievement });
    dispatch(openModal());
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete: ${name}`)) {
      deleteCustomAchievementMutate.mutate(id);
    }
  };
  if (error) return <Error error={error} onRefresh={refetch} />;
  const filterOpts: Options<keyof Achievement> = {
    ...getPossibleCommonField("search_name"),
    custom_action: { type: "text", placeholder: "Custom Action" },
  };

  const sortOptsOpts: SortByOptions<
    keyof Pick<Achievement, "name" | "isTime" | "enabled">
  > = {
    name: "Name",
    enabled: "Enabled",
    isTime: "Is time",
  };

  return (
    <div className="achievements-page">
      <div className="base-header-wrapper">
        <NavigateButton />
      </div>

      <div className="achievements-page__title-row">
        <h2 className="achievements-page__title">Achievements</h2>
        <Filter options={filterOpts} />
        <SortBy
          options={sortOptsOpts}
          buttonsProps={{
            size: "small",
          }}
        />
        <CreateCustomAchievementButton />
      </div>

      <div className="achievements-page__grid">
        {isLoading ? (
          <>
            <AchievementCardSkeleton />
            <AchievementCardSkeleton />
            <AchievementCardSkeleton />
          </>
        ) : (
          achievementsData?.data.map((achievement) => (
            <AchievementCard
              key={achievement._id}
              achievement={achievement}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <div className="achievements-page__pagination">
        <Pagination
          localStorageName="achievementsListPageSize"
          currentPage={achievementsData?.currentPage}
          totalCount={achievementsData?.count}
        />
      </div>
      <EditCreateAchievementModal />
    </div>
  );
}
