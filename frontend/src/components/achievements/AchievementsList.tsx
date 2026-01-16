import NavigateButton from "@components/navigateButton";

import AchievementsListData from "./AchievementsListData";
import {
  Achievement,
  fetchAchievementsDefaultParams,
  useGetAchievements,
} from "@services";
import { Error, Loading } from "@components/axiosHelper";
import EditCreateAchievementModal from "./EditCreateAchievementModal";
import { useQueryParams } from "@hooks/useQueryParams";
import { TableList } from "@components/tableWrapper";
import Filter, {
  getPossibleCommonField,
  Options,
} from "@components/filter/Filter";

export default function AchievementsList() {
  const queryParams = useQueryParams(fetchAchievementsDefaultParams);
  const {
    data: achievementsData,
    isLoading,
    error,
  } = useGetAchievements(queryParams);

  if (error) return <Error error={error} />;
  if (isLoading || !achievementsData) return <Loading />;

  const filterOpts: Options<keyof Achievement> = {
    ...getPossibleCommonField("search_name"),
    custom_action: { type: "text", placeholder: "Custom Action" },
  };

  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
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
    </div>
  );
}
