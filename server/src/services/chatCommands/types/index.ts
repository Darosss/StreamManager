import { ChatCommandModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface ChatCommandsFindOptions {
  select?: SelectQuery<ChatCommandModel>;
  populate?: PopulateSelect;
}

export interface ManyChatCommandsFindOptions extends ChatCommandsFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}
