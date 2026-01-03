import NavigateButton from "@components/navigateButton";

import AchievementsListData from "./AchievementsListData";
import FilterBarAchievements from "./FilterBarAchievements";
import { fetchAchievementsDefaultParams, useGetAchievements } from "@services";
import { Error, Loading } from "@components/axiosHelper";
import EditCreateAchievementModal from "./EditCreateAchievementModal";
import { useQueryParams } from "@hooks/useQueryParams";
import { TableList } from "@components/tableWrapper";

export default function AchievementsList() {
  const queryParams = useQueryParams(fetchAchievementsDefaultParams);
  const {
    data: achievementsData,
    isLoading,
    error,
  } = useGetAchievements(queryParams);

  if (error) return <Error error={error} />;
  if (isLoading || !achievementsData) return <Loading />;

  return (
    <>
      <NavigateButton />
      <FilterBarAchievements />
      <TableList
        paginationProps={{
          localStorageName: "achievementsListPageSize",
          currentPage: achievementsData.currentPage,
          totalCount: achievementsData.count,
          siblingCount: 1,
        }}
      >
        <AchievementsListData achievements={achievementsData.data} />
      </TableList>
      <EditCreateAchievementModal />
    </>
  );
}
