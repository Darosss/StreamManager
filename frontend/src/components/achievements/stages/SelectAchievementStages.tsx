import { Button } from "@components/ui/button";
import { Select } from "@components/ui/select";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { AchievementStage, useGetAchievementStages } from "@services";
import { useEffect, useState } from "react";
import { Link } from "react-router";

interface AchievementStageSelectValue {
  value: string;
  label: string;
}

type UseSelectAchievementStagesParams =
  | {
      stageId: string;
    }
  | {
      stage: AchievementStage;
    };

export interface SelectAchievementStagesProps {
  params: UseSelectAchievementStagesParams;
  onChangeSelect: (data: AchievementStageSelectValue) => void;
}

export const SelectAchievementStages = ({
  params,
  onChangeSelect,
}: SelectAchievementStagesProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [achievementStagesNameFilter, setAchievementStagesNameFilter] =
    useState("");
  const debouncedSearchInput = useDebouncedValue(searchInput, 300);
  const { data: achievementStagesResponse, refetch: refetchAchievementStages } =
    useGetAchievementStages({ search_name: achievementStagesNameFilter });
  const options = achievementStagesResponse?.data?.map((value) => ({
    value: value._id,
    label: value.name,
  }));
  useEffect(() => {
    setAchievementStagesNameFilter(debouncedSearchInput);
  }, [debouncedSearchInput]);

  const defaultValue =
    "stageId" in params
      ? {
          label:
            achievementStagesResponse?.data.find(
              (data) => data._id === params.stageId
            )?.name || "-",
          value: params.stageId,
        }
      : { label: params.stage.name, value: params.stage._id };

  return (
    <div>
      <Select
        placeholder="Select stage"
        defaultValue={defaultValue}
        isSearchable={true}
        onChangeSearch={setSearchInput}
        options={options}
        onSelect={(value) => (value ? onChangeSelect(value) : null)}
      />
      <div className="stages-actions">
        <Button variant="secondary" onClick={() => refetchAchievementStages()}>
          🔃
        </Button>
        <Link
          to="/achievements/stages"
          target="_blank"
          className="common-button tertiary-button"
        >
          Create
        </Link>
      </div>
    </div>
  );
};
