import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BaseEndpointNames,
  customAxios,
  PromiseBackendData,
  PromisePaginationData,
  queryKeysParamsHelper,
  QueryParams,
  refetchDataFunctionHelper,
} from "../api";
import { FetchMessagesParams, Message } from "../messages";
import { FetchRedemptionsParams, Redemption } from "../redemptions";
import {
  User,
  UserUpdateData,
  FirstAndLatestMsgs,
  FetchUsersParams,
} from "./types";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

export const fetchUsersDefaultParams: Required<FetchUsersParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "asc",
  sortBy: "createdAt",
  privilege: 0,
  seen_start: "",
  seen_end: "",
  created_start: "",
  created_end: "",
};

const baseEndpointName = BaseEndpointNames.USERS;
export const queryKeysUsers = {
  allUsers: (params?: QueryParams<keyof FetchUsersParams>) => [
    "users",
    ...(params ? Object.entries(params).join(",") : []),
  ],
  userById: (id: string) => ["users", id] as [string, string],
  userMessages: (id: string, params?: QueryParams<keyof FetchMessagesParams>) =>
    ["users-messages", id, queryKeysParamsHelper(params)] as [
      string,
      string,
      string
    ],
  userFirstLatestMessages: (id: string) =>
    ["users-messages-latest-eldest", id] as [string, string],
  getUsersByIds: (id: string[]) =>
    ["get-users-by-ids", id.join(",")] as [string, string],
  userRedemptions: (
    id: string,
    params?: QueryParams<keyof FetchRedemptionsParams>
  ) =>
    ["users-redemptions", id, queryKeysParamsHelper(params)] as [
      string,
      string,
      string
    ],
};

export const fetchUsers = async (
  params?: QueryParams<keyof FetchUsersParams>
): PromisePaginationData<User> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};
export const fetchUserById = async (id: string): PromiseBackendData<User> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}`);
  return response.data;
};

export const fetchUserMessages = async (
  id: string,
  params?: QueryParams<keyof FetchUsersParams>
): PromisePaginationData<Message> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/messages`,
    { params }
  );
  return response.data;
};

export const fetchUserLatestEldestMsgs = async (
  id: string
): PromiseBackendData<FirstAndLatestMsgs> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/messages/latest-eldest`
  );
  return response.data;
};

export const fetchUserRedemptions = async (
  id: string,
  params?: QueryParams<keyof FetchUsersParams>
): PromisePaginationData<Redemption> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/redemptions`,
    { params }
  );
  return response.data;
};
export const fetchUsersByIds = async (
  ids: string[]
): PromisePaginationData<User> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/users/by-ids/${ids.join(",")}`
  );
  return response.data;
};

export const editUser = async ({
  id,
  updatedUser,
}: {
  id: string;
  updatedUser: UserUpdateData;
}): PromiseBackendData<User> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedUser
  );
  return response.data;
};

export const useGetUsers = (params?: QueryParams<keyof FetchUsersParams>) => {
  return useQuery({
    queryKey: queryKeysUsers.allUsers(params),
    queryFn: () => fetchUsers(params),
  });
};

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: queryKeysUsers.userById(id),
    queryFn: () => fetchUserById(id),
  });
};

export const useEditUser = () => {
  const refetchUsers = useRefetchUsersData();
  return useCustomMutation(
    editUser,
    {
      entity: MutationEntity.USER,
      action: MutationAction.EDIT,
    },
    { onSuccess: refetchUsers }
  );
};

export const useGetUserMessages = (
  id: string,
  params?: QueryParams<keyof FetchMessagesParams>
) => {
  return useQuery({
    queryKey: queryKeysUsers.userMessages(id, params),
    queryFn: () => fetchUserMessages(id, params),
  });
};

export const useGetLatestEldestMsgs = (id: string) => {
  return useQuery({
    queryKey: queryKeysUsers.userFirstLatestMessages(id),
    queryFn: () => fetchUserLatestEldestMsgs(id),
  });
};

export const useGetUsersByIds = (ids: string[]) => {
  return useQuery({
    queryKey: queryKeysUsers.getUsersByIds(ids),
    queryFn: () => fetchUsersByIds(ids),
  });
};

export const useGetUserRedemptions = (
  id: string,
  params?: QueryParams<keyof FetchRedemptionsParams>
) => {
  return useQuery({
    queryKey: queryKeysUsers.userRedemptions(id, params),
    queryFn: () => fetchUserRedemptions(id, params),
  });
};

export const useRefetchUsersData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysUsers,
    "allUsers",
    queryClient,
    [],
    exact
  );
};
