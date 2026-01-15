import { useQuery } from "@tanstack/react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
  PromiseBackendData,
  queryKeysParamsHelper,
} from "../api";
import { FetchMessagesParams, Message } from "../messages";
import {
  FetchStreamSessionsParams,
  StreamSession,
  StreamSessionRedemptions,
  StreamSessionStatistics,
} from "./types";
import { FetchRedemptionsParams, Redemption } from "../redemptions";

export const fetchStreamSessionsDefaultParams: Required<FetchStreamSessionsParams> =
  {
    limit: 10,
    page: 1,
    search_name: "",
    sortOrder: "asc",
    sortBy: "sessionStart",
    start_date: "",
    end_date: "",
    tags: "",
    categories: "",
  };

const baseEndpointName = BaseEndpointNames.STREAM_SESSIONS;

export const queryKeysStreamSessions = {
  allStreamSessions: (
    params?: QueryParams<keyof FetchStreamSessionsParams>
  ) => ["stream-sessions", ...(params ? Object.entries(params).join(",") : [])],
  streamSessionById: (id: string) => ["stream-session", id] as [string, string],
  streamSessionMessages: (
    id: string,
    params?: QueryParams<keyof FetchMessagesParams>
  ) =>
    ["stream-sessions-messages", id, queryKeysParamsHelper(params)] as [
      string,
      string,
      string
    ],
  streamSessionRedemptions: (
    id: string,
    params?: QueryParams<keyof FetchMessagesParams>
  ) =>
    ["stream-sessions-redemptions", id, queryKeysParamsHelper(params)] as [
      string,
      string,
      string
    ],
  currentStreamSessionMessages: ["current-stream-session-messages"],
  currentStreamSessionStatistics: ["current-stream-session-statistics"],
  currentStreamSessionRedemptions: ["current-stream-session-redemptions"],
};

export const fetchStreamSessions = async (
  params?: QueryParams<keyof FetchStreamSessionsParams>
): PromisePaginationData<StreamSession> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const fetchSessionById = async (
  id: string
): PromiseBackendData<StreamSession> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}`);
  return response.data;
};

export const fetchSessionMessages = async (
  id: string,
  params?: QueryParams<keyof FetchMessagesParams>
): PromisePaginationData<Message> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/messages`,
    { params }
  );
  return response.data;
};
export const fetchSessionRedemptions = async (
  id: string,
  params?: QueryParams<keyof FetchRedemptionsParams>
): PromisePaginationData<Redemption> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/redemptions`,
    { params }
  );
  return response.data;
};

export const fetchCurrentSessionMessages = async (
  params?: QueryParams<keyof FetchMessagesParams>
): PromisePaginationData<Message> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/current-session/messages`,
    { params }
  );
  return response.data;
};

export const fetchCurrentSessionStatistics =
  async (): PromiseBackendData<StreamSessionStatistics | null> => {
    const response = await customAxios.get(
      `/${baseEndpointName}/current-session/statistics`
    );
    return response.data;
  };

export const fetchCurrentSessionRedemptions = async (
  params?: QueryParams<keyof FetchRedemptionsParams>
): PromiseBackendData<StreamSessionRedemptions> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/current-session/redemptions`,
    { params }
  );
  return response.data;
};

export const useGetSessions = (
  params?: QueryParams<keyof FetchStreamSessionsParams>
) => {
  return useQuery({
    queryKey: queryKeysStreamSessions.allStreamSessions(params),
    queryFn: () => fetchStreamSessions(params),
  });
};

export const useGetSessionById = (id: string) => {
  return useQuery({
    queryKey: queryKeysStreamSessions.streamSessionById(id),
    queryFn: () => fetchSessionById(id),
  });
};

export const useGetSessionMessages = (
  id: string,
  params?: QueryParams<keyof FetchMessagesParams>
) => {
  return useQuery({
    queryKey: queryKeysStreamSessions.streamSessionMessages(id, params),
    queryFn: () => fetchSessionMessages(id, params),
  });
};
export const useGetSessionRedemptions = (
  id: string,
  params?: QueryParams<keyof FetchRedemptionsParams>
) => {
  return useQuery({
    queryKey: queryKeysStreamSessions.streamSessionRedemptions(id, params),
    queryFn: () => fetchSessionRedemptions(id, params),
  });
};

export const useGetCurrentSessionMessages = (
  params?: QueryParams<keyof FetchMessagesParams>
) => {
  return useQuery({
    queryKey: queryKeysStreamSessions.currentStreamSessionMessages,
    queryFn: () => fetchCurrentSessionMessages(params),
  });
};

export const useGetCurrentSessionStatistics = () => {
  return useQuery({
    queryKey: queryKeysStreamSessions.currentStreamSessionStatistics,
    queryFn: fetchCurrentSessionStatistics,
  });
};

export const useGetCurrentSessionRedemptions = (
  params?: QueryParams<keyof FetchRedemptionsParams>
) => {
  return useQuery({
    queryKey: queryKeysStreamSessions.currentStreamSessionRedemptions,
    queryFn: () => fetchCurrentSessionRedemptions(params),
  });
};
