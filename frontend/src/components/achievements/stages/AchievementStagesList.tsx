import NavigateButton from "@components/navigateButton";
import AchievementStagesData from "./AchievementStagesData";
import { AchievementStage, useGetAchievementStages } from "@services";
import { Error, Loading } from "@components/axiosHelper";
import { TableList } from "@components/tableWrapper";
import Filter from "@components/filter";
import { getPossibleCommonField, Options } from "@components/filter/Filter";

export default function AchievementStagesList() {
  const { data: stagesData, isLoading, error } = useGetAchievementStages();

  if (error) return <Error error={error} />;
  if (isLoading || !stagesData) return <Loading />;

  const filterOpts: Options<keyof AchievementStage> = {
    ...getPossibleCommonField("search_name"),
    stageName: { type: "text", placeholder: "Stage" },
  };

  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
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
    </div>
  );
}
