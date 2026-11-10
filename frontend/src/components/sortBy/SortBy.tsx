import { Button, ButtonProps } from "@components/ui/button";
import { useSearchParams } from "react-router";
export type SortByOptions<T extends string> = Record<T, string>;

interface SortByProps<OptionsKeys extends string> {
  options: SortByOptions<OptionsKeys>;
  buttonsProps?: Omit<Partial<ButtonProps>, "onClick" | "children">;
}
export default function SortBy<OptionsKeys extends string>({
  options,
  buttonsProps,
}: SortByProps<OptionsKeys>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOrderParam = searchParams.get("sortOrder");
  const sortBy = searchParams.get("sortBy");
  const currentSearch =
    sortOrderParam === "asc"
      ? "\u2191"
      : sortOrderParam === "desc"
        ? "\u2193"
        : null;

  const handleOnClickSortBtn = (sortBy: OptionsKeys) => {
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
    <div className="sort-by">
      <div className="sort-by__content">
        {Object.entries(options).map(([key, value]) => {
          return (
            <div key={key}>
              <Button
                {...buttonsProps}
                className="sort-by__button"
                onClick={() => handleOnClickSortBtn(key as OptionsKeys)}
              >
                <div>{value as string}</div>
                {sortBy === key && (
                  <div className="sort-by__current-search">{currentSearch}</div>
                )}
              </Button>
            </div>
          );
        })}
      </div>
      {sortBy || currentSearch ? (
        <Button variant="danger" {...buttonsProps} onClick={removeSortParams}>
          X
        </Button>
      ) : null}
    </div>
  );
}
