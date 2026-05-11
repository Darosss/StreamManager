import { WidgetsDocument } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";
export interface WidgetsFindOptions {
  select?: SelectQuery<WidgetsDocument>;
  populate?: PopulateSelect;
}

export interface ManyWidgetsFindOptions extends WidgetsFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}
