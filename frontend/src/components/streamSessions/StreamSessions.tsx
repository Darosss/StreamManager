import { Link } from "react-router";
import NavigateButton from "@components/navigateButton";
import {
  fetchStreamSessionsDefaultParams,
  StreamSession,
  useGetSessions,
} from "@services";
import { DateDifference, DateTooltip } from "@components/dateTooltip";
import SortByParamsButton from "@components/SortByParamsButton";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";
import { TableList } from "@components/tableWrapper";
import Filter from "@components/filter";
import { getPossibleCommonField, Options } from "@components/filter/Filter";

export default function StreamSessions() {
  const searchParams = useQueryParams(fetchStreamSessionsDefaultParams);
  const { data: sessionsData, isLoading, error } = useGetSessions(searchParams);

  if (error) return <Error error={error} />;
  if (!sessionsData || isLoading) return <Loading />;

  const { data, count, currentPage } = sessionsData;
  const filterOpts: Options<keyof StreamSession> = {
    ...getPossibleCommonField("search_name"),
    tags: { type: "search", placeholder: "Tags" },
    categories: { type: "search", placeholder: "Categories" },
    ...getPossibleCommonField("start_date"),
    ...getPossibleCommonField("end_date"),
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />

        <Filter options={filterOpts} />
      </div>
      <TableList
        paginationProps={{
          localStorageName: "streamSessionPageSize",
          currentPage: currentPage,
          totalCount: count,
          siblingCount: 1,
        }}
      >
        <table className="stream-session-list">
          <thead>
            <tr>
              <th colSpan={3}>Action </th>
              <th>
                <SortByParamsButton
                  buttonText="Titles"
                  sortBy="sessionTitles"
                />
              </th>
              <th>
                <SortByParamsButton
                  buttonText="Start date"
                  sortBy="sessionStart"
                />
              </th>
              <th>Session time</th>
              <th>
                <SortByParamsButton buttonText="End date" sortBy="sessionEnd" />
              </th>
              <th>Tags</th>
              <th>
                <SortByParamsButton
                  buttonText="Categories"
                  sortBy="categories"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((session, index) => (
              <tr key={index}>
                <td colSpan={3}>
                  <div className="sessions-list-actions">
                    <Link to={`./${session._id}/messages`}>Messages</Link>
                    <Link to={`./${session._id}/redemptions`}>Redemptions</Link>
                    <Link to={`/stream-sessions/${session._id}`}>
                      Session profile
                    </Link>
                  </div>
                </td>

                <td className="sessions-list-title">
                  {Object.values(session.sessionTitles)[0]}
                </td>
                <td className="sessions-list-date">
                  <DateTooltip date={session.sessionStart} />
                </td>
                <td className="sessions-list-date">
                  {session.sessionEnd ? (
                    <DateDifference
                      dateStart={session.sessionStart}
                      dateEnd={session.sessionEnd}
                      format="h"
                    />
                  ) : null}
                </td>
                <td className="sessions-list-date">
                  {session.sessionEnd ? (
                    <DateTooltip date={session.sessionEnd} />
                  ) : null}
                </td>
                <td>{session.tags ? Object.values(session.tags) : null}</td>
                <td>{Object.values(session.categories)[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableList>
    </div>
  );
}
