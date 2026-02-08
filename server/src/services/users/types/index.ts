import { BadgeModel, UserModel } from "@models";
import { SortQuery, SelectQuery } from "@services";

export interface UserPopulateOptions {
  displayBadges?: boolean;
}
export interface UserFindOptions {
  select?: SelectQuery<UserModel>;
  populate?: UserPopulateOptions;
}

export interface ManyUsersFindOptions extends UserFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type UserReturnType<DBadgesPopulate extends boolean> = UserModel<
  DBadgesPopulate extends true ? BadgeModel : string
>;
