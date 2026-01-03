import NavigateButton from "@components/navigateButton";
import BadgesListData from "./BadgesListData";
import FilterBarBadges from "./FilterBarBadges";
import { useGetBadges } from "@services";
import { Error, Loading } from "@components/axiosHelper";
import { TableList } from "@components/tableWrapper";

export default function BadgesList() {
  const { data: badges, isLoading, error } = useGetBadges();
  if (error) return <Error error={error} />;
  if (isLoading || !badges) return <Loading />;

  return (
    <>
      <NavigateButton />
      <FilterBarBadges />
      <TableList
        paginationProps={{
          localStorageName: "badgesListPageSize",
          currentPage: badges.currentPage,
          totalCount: badges.count,
          siblingCount: 1,
        }}
      >
        <BadgesListData badges={badges.data} />
      </TableList>
    </>
  );
}
