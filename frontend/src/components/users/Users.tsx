import NavigateButton from "@components/navigateButton";
import { fetchUsersDefaultParams, useGetUsers } from "@services";
import FilterBarUsers from "./filterBarUsers";
import UsersDetails from "./UsersDetails";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";
import { TableList } from "@components/tableWrapper";

export default function Users() {
  const searchParams = useQueryParams(fetchUsersDefaultParams);
  const { data: usersData, isLoading, error } = useGetUsers(searchParams);

  if (error) return <Error error={error} />;
  if (!usersData || isLoading) return <Loading />;

  const { data, count, currentPage } = usersData;
  return (
    <>
      <NavigateButton />
      <FilterBarUsers />
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
    </>
  );
}
