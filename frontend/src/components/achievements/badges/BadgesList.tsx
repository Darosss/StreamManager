import NavigateButton from "@components/navigateButton";
import BadgesListData from "./BadgesListData";
import { Badge, useGetBadges } from "@services";
import { Error, Loading } from "@components/axiosHelper";
import { TableList } from "@components/tableWrapper";
import Filter, {
  getPossibleCommonField,
  Options,
} from "@components/filter/Filter";

export default function BadgesList() {
  const { data: badges, isLoading, error } = useGetBadges();
  if (error) return <Error error={error} />;
  if (isLoading || !badges) return <Loading />;
  const filterOpts: Options<keyof Badge> = {
    ...getPossibleCommonField("search_name"),
    imagesUrls: { type: "text", placeholder: "Image urls" },
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
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
    </div>
  );
}
