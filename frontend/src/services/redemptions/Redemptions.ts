import { useQuery } from "@tanstack/react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
} from "../api";
import { FetchRedemptionsParams, Redemption } from "./types";

export const fetchRedemptionsDefaultParams: Required<FetchRedemptionsParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "asc",
  sortBy: "redemptionDate",
  message: "",
  receiver: "",
  cost: 0,
  start_date: "",
  end_date: "",
};

const baseEndpointName = BaseEndpointNames.REDEMPTIONS;
export const queryKeysRedemptions = {
  allRedemptions: (params?: QueryParams<keyof FetchRedemptionsParams>) => [
    "redemptions",
    ...(params ? Object.entries(params).join(",") : []),
  ],
};

export const fetchRedemptions = async (
  params?: QueryParams<keyof FetchRedemptionsParams>
): PromisePaginationData<Redemption> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const useGetRedemptions = (
  params?: QueryParams<keyof FetchRedemptionsParams>
) => {
  return useQuery({
    queryKey: queryKeysRedemptions.allRedemptions(params),
    queryFn: () => fetchRedemptions(params),
  });
};
