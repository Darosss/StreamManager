import { Button } from "@components/ui/button";
import { useSearchParams } from "react-router";

interface SortByParamsButtonProps {
  buttonText: string;
  sortBy: string;
}

//TODO: NOTE: replace this into usage of SortBy or similar common component. For now it stays
// cuz many  chagnes in tables. Now its simply almost  ismilar to SortBy component. Tho used mostly  for tables
export default function SortByParamsButton({
  buttonText,
  sortBy,
}: SortByParamsButtonProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOrderParam = searchParams.get("sortOrder");
  const currentSearch =
    sortOrderParam === "asc"
      ? "\u2191"
      : sortOrderParam === "desc"
        ? "\u2193"
        : null;

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
    return "asc";
  };

  const removeSortParams = () => {
    setSearchParams((prevState) => {
      prevState.delete("sortOrder");
      prevState.delete("sortBy");
      return new URLSearchParams(prevState);
    });
  };

  return (
    <div className="sort-by-params-button-wrapper">
      <div>
        <Button
          className="sort-by-params-button"
          onClick={handleOnClickSortBtn}
        >
          {buttonText}
          {currentSearch && <span>{currentSearch}</span>}
        </Button>
        <Button
          className="sort-by-params-remove-sort"
          variant="danger"
          onClick={removeSortParams}
        >
          X
        </Button>
      </div>
    </div>
  );
}
