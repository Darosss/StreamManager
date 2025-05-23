import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface SortByParamsButtonProps {
  buttonText: string;
  sortBy: string;
}

export default function SortByParamsButton({
  buttonText,
  sortBy,
}: SortByParamsButtonProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSearch, setCurrentSearch] = useState("");

  useEffect(() => {
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");
    if (sortOrderParam === "asc") {
      setCurrentSearch("\u2191");
    } else {
      setCurrentSearch("\u2193");
    }

    if (sortByParam !== sortBy) setCurrentSearch("");
  }, [searchParams, sortBy]);

  useEffect(() => {
    if (!currentSearch) return;
  }, [currentSearch]);

  const handleOnClickSortBtn = () => {
    setSearchParams((prevState) => {
      prevState.set("sortBy", sortBy);
      const sortOrder = prevState.get("sortOrder");
      prevState.set("sortOrder", handleOnSortOrder(sortOrder));

      return prevState;
    });
  };

  const handleOnSortOrder = (sortOrder: string | null) => {
    if (sortOrder === "asc") {
      return "desc";
    }
    setCurrentSearch("\u2193");
    return "asc";
  };

  const removeSortParams = () => {
    setSearchParams((prevState) => {
      prevState.delete("sortOrder");
      prevState.delete("sortBy");
      return prevState;
    });
  };

  return (
    <div className="sort-by-params-button-wrapper">
      <div>
        <button
          className="common-button sort-by-params-button"
          onClick={handleOnClickSortBtn}
        >
          {buttonText}
          <span>{currentSearch}</span>
        </button>
        <button
          className="sort-by-params-remove-sort danger-button"
          onClick={removeSortParams}
        >
          X
        </button>
      </div>
    </div>
  );
}
