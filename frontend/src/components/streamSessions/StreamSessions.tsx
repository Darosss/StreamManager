import Pagination from "@components/pagination";
import { Link } from "react-router-dom";
import NavigateButton from "@components/navigateButton";
import FilterBarSessions from "./filterBarSessions";
import { fetchStreamSessionsDefaultParams, useGetSessions } from "@services";
import { DateDifference, DateTooltip } from "@components/dateTooltip";
import SortByParamsButton from "@components/SortByParamsButton";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";

export default function StreamSessions() {
  const searchParams = useQueryParams(fetchStreamSessionsDefaultParams);
  const { data: sessionsData, isLoading, error } = useGetSessions(searchParams);

  if (error) return <Error error={error} />;
  if (!sessionsData || isLoading) return <Loading />;

  const { data, count, currentPage } = sessionsData;

  return (
    <>
      <NavigateButton />
      <FilterBarSessions />
      <div id="stream-session-list" className="table-list-wrapper">
        <table id="table-stream-session-list">
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
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          localStorageName="streamSessionPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
}
