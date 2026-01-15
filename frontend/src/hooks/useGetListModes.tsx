import { QueryObserverResult } from "react-query";
import { Affix, useGetAffixes } from "src/services/affixes";
import { PaginationData } from "src/services/api";
import { Mood, useGetMoods } from "src/services/moods";
import { Tag, useGetTags } from "src/services/tags";

export interface AllModesReturn {
  tags: Tag[];
  affixes: Affix[];
  moods: Mood[];
  refetchTags: () => Promise<QueryObserverResult<PaginationData<Tag>, unknown>>;
  refetchAffixes: () => Promise<
    QueryObserverResult<PaginationData<Affix>, unknown>
  >;
  refetchMoods: () => Promise<
    QueryObserverResult<PaginationData<Mood>, unknown>
  >;
}

export const useGetAllModes = (): AllModesReturn => {
  const { data: tags, refetch: refetchTags } = useGetTags();
  const { data: affixes, refetch: refetchAffixes } = useGetAffixes();
  const { data: moods, refetch: refetchMoods } = useGetMoods();

  return {
    tags: tags?.data || [],
    affixes: affixes?.data || [],
    moods: moods?.data || [],
    refetchTags: refetchTags,
    refetchAffixes: refetchAffixes,
    refetchMoods: refetchMoods,
  };
};
