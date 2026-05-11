import { TriggerModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface TriggerFindOptions {
  select?: SelectQuery<TriggerModel>;
  populate?: PopulateSelect;
}

export interface ManyTriggersFindOptions extends TriggerFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}
