import { MoodModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface MoodFindOptions {
  select?: SelectQuery<MoodModel>;
  populate?: PopulateSelect;
}

export interface ManyMoodsFindOptions extends MoodFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}
