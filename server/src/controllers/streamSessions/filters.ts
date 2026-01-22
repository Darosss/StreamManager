import { StreamSessionModel } from "@models";
import { RequestQuerySession } from "./types";
import { getFilterForMap } from "@utils";

export const filterSessionByUrlParams = (params: RequestQuerySession) => {
  const { search_name, start_date, end_date, tags, categories } = params;

  const filterTitles = {
    ...(search_name && getFilterForMap<StreamSessionModel>("sessionTitles", search_name))
  };

  const filterCategories = {
    ...(categories && getFilterForMap<StreamSessionModel>("categories", categories))
  };
  const filterTags = {
    ...(tags && getFilterForMap<StreamSessionModel>("tags", tags))
  };

  const filterStarted = {
    ...(start_date &&
      end_date === undefined && {
        sessionStart: { $gte: new Date(start_date) }
      }),
    ...(end_date &&
      start_date === undefined && {
        sessionStart: { $lte: new Date(end_date) }
      }),
    ...(start_date &&
      end_date && {
        $and: [{ sessionStart: { $gte: new Date(start_date) } }, { sessionStart: { $lte: new Date(end_date) } }]
      })
  };

  const searchFilter = {
    $and: [filterTitles, filterCategories, filterTags, filterStarted]
  };

  return searchFilter;
};
