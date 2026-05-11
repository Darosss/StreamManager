import { TimerModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface TimerFindOptions {
  select?: SelectQuery<TimerModel>;
  populate?: PopulateSelect;
}

export interface ManyTimersFindOptions extends TimerFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}
