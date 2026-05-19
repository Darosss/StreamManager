import { SortQuery, SelectQuery, PopulateSelect } from "@services";
import { MessageCategoryDocument } from "@models";

export interface MessageCategoryFindOptions {
  select?: SelectQuery<MessageCategoryDocument>;
  populate?: PopulateSelect;
}

export interface ManyMessageCategoriesFindOptions extends MessageCategoryFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}
