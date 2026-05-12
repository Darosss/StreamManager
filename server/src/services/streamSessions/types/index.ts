import { SortQuery, SelectQuery } from "@services";
import { StreamSessionModel } from "@models";

export interface StreamSessionFindOptions {
  select?: SelectQuery<StreamSessionModel>;
}

export interface ManyStreamSessionsFindOptions extends StreamSessionFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export interface StreamSessionStatisticOptions {
  limitTopMessageUsers?: number;
  limitTopRedemptionsUsers?: number;
  limitMostUsedWords?: number;
  limitViewers?: number;
}
