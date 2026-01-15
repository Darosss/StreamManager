import { Link, useParams } from "react-router";
import NavigateButton from "@components/navigateButton";
import {
  PaginationData,
  useGetMessages,
  Message,
  useGetUserMessages,
  useGetSessionMessages,
  fetchMessagesDefaultParams,
} from "@services";
import { DateTooltip } from "@components/dateTooltip";
import SortByParamsButton from "@components/SortByParamsButton";
import ErrorHelper from "@components/axiosHelper/errors";
import Loading from "@components/axiosHelper/loading";

import { useQueryParams } from "@hooks/useQueryParams";
import { TableList, TableListWrapper } from "@components/tableWrapper";
import Filter from "@components/filter";
import { getPossibleCommonField, Options } from "@components/filter/Filter";

interface MessagesDetailsProp {
  messages: Message[];
}

interface MessagesListProps {
  messages: "user" | "session" | "all";
}

interface MessagesProps {
  messagesData: PaginationData<Message>;
}

export default function MessagesList({ messages }: MessagesListProps) {
  const { userId, sessionId } = useParams();

  switch (messages) {
    case "session":
      return sessionId ? (
        <MessagesSession sessionId={sessionId} />
      ) : (
        <ErrorHelper
          error={
            new Error(
              "Session id must be provided in order to get session messages"
            )
          }
        />
      );
    case "user":
      return userId ? (
        <MessagesUser userId={userId} />
      ) : (
        <ErrorHelper
          error={
            new Error("User id must be provided in order to get user messages")
          }
        />
      );
    case "all":
    default:
      return <MessagesAll />;
  }
}

interface MessagesUserProps {
  userId: string;
}

const MessagesUser = ({ userId }: MessagesUserProps) => {
  const queryParams = useQueryParams(fetchMessagesDefaultParams);
  const { data, isLoading, error } = useGetUserMessages(userId, queryParams);

  if (error) return <ErrorHelper error={error} />;
  if (!data || isLoading) return <Loading />;
  return <Messages messagesData={data} />;
};

interface MessagesSessionProps {
  sessionId: string;
}

const MessagesSession = ({ sessionId }: MessagesSessionProps) => {
  const queryParams = useQueryParams(fetchMessagesDefaultParams);
  const { data, isLoading, error } = useGetSessionMessages(
    sessionId,
    queryParams
  );
  if (error) return <ErrorHelper error={error} />;
  if (!data || isLoading) return <Loading />;

  return <Messages messagesData={data} />;
};

const MessagesAll = () => {
  const queryParams = useQueryParams(fetchMessagesDefaultParams);
  console.log(queryParams, "jakie?");
  const { data, isLoading, error } = useGetMessages(queryParams);
  if (error) return <ErrorHelper error={error} />;
  if (!data || isLoading) return <Loading />;

  return <Messages messagesData={data} />;
};

const MessagesDetails = ({ messages }: MessagesDetailsProp) => (
  <TableListWrapper
    className="table-messages-list"
    theadChildren={
      <tr>
        <th>
          <SortByParamsButton buttonText="Date" sortBy="date" />
        </th>
        <th>Username</th>
        <th colSpan={4}>
          <SortByParamsButton buttonText="Message" sortBy="message" />
        </th>
      </tr>
    }
    tbodyChildren={messages.map((message, index) => (
      <tr key={index}>
        <td className="message-time">
          <DateTooltip date={message.date} />
        </td>

        <td className="message-username">
          <Link to={`/users/${message.owner._id}`}>
            {message.owner.username}
          </Link>
        </td>
        <td className="message" colSpan={4}>
          {message.message}
        </td>
      </tr>
    ))}
  />
);

const Messages = ({
  messagesData: { data, currentPage, count },
}: MessagesProps) => {
  const options: Options<keyof Message> = {
    ...getPossibleCommonField("search_name"),
    owner: { type: "text", placeholder: "Owner" },
    ...getPossibleCommonField("end_date"),
    ...getPossibleCommonField("start_date"),
  };
  return (
    <div>
      <div className="messages-header-wrapper">
        <NavigateButton />
        <Filter options={options} />
      </div>
      <TableList
        paginationProps={{
          currentPage: currentPage,
          totalCount: count,
          localStorageName: "messagesListPageSize",
          siblingCount: 1,
        }}
      >
        <MessagesDetails messages={data} />
      </TableList>
    </div>
  );
};
