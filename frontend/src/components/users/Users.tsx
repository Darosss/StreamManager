import NavigateButton from "@components/navigateButton";
import { fetchUsersDefaultParams, useGetUsers, User } from "@services";
import UsersDetails from "./UsersDetails";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";
import { TableList } from "@components/tableWrapper";
import Filter from "@components/filter";
import { getPossibleCommonField, Options } from "@components/filter/Filter";

export default function Users() {
  const searchParams = useQueryParams(fetchUsersDefaultParams);
  const { data: usersData, isLoading, error } = useGetUsers(searchParams);

  if (error) return <Error error={error} />;
  if (!usersData || isLoading) return <Loading />;

  const { data, count, currentPage } = usersData;

  const filterOpts: Options<keyof User> = {
    ...getPossibleCommonField("search_name"),
    privilege: { type: "number", placeholder: "Privilege" },
    seen_start: { type: "datetime-local", placeholder: "Last seen start" },
    seen_end: { type: "datetime-local", placeholder: "Last seen start" },
    created_start: { type: "datetime-local", placeholder: "Created start" },
    created_end: { type: "datetime-local", placeholder: "Created start" },
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
      <TableList
        paginationProps={{
          localStorageName: "usersPageSize",
          currentPage: currentPage,
          totalCount: count,
          siblingCount: 1,
        }}
      >
        <UsersDetails users={data} />
      </TableList>
    </div>
  );
}
