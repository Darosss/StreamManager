import NavigateButton from "@components/navigateButton";
import AchievementStagesData from "./AchievementStagesData";
import FilterBarStages from "./FilterBarStages";
import { useGetAchievementStages } from "@services";
import { Error, Loading } from "@components/axiosHelper";
import { TableList } from "@components/tableWrapper";

export default function AchievementStagesList() {
  const { data: stagesData, isLoading, error } = useGetAchievementStages();

  if (error) return <Error error={error} />;
  if (isLoading || !stagesData) return <Loading />;

  return (
    <>
      <NavigateButton />
      <FilterBarStages />
      <TableList
        paginationProps={{
          localStorageName: "achievementStagesPageSize",
          currentPage: stagesData.currentPage,
          totalCount: stagesData.count,
          siblingCount: 1,
        }}
      >
        <AchievementStagesData data={stagesData.data} />
      </TableList>
    </>
  );
}
