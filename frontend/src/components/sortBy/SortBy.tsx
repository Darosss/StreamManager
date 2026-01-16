import { Button, ButtonProps } from "@components/ui/button";
import { useEffect, useState } from "react";
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
  const [currentSearch, setCurrentSearch] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>();

  useEffect(() => {
    const sortOrderParam = searchParams.get("sortOrder");
    const sortBy = searchParams.get("sortBy");
    if (sortOrderParam === "asc") {
      setCurrentSearch("\u2191");
    } else if (sortOrderParam === "desc") {
      setCurrentSearch("\u2193");
    }
    setSortBy(sortBy);
  }, [searchParams]);

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
    setCurrentSearch("\u2193");
    return "asc";
  };

  const removeSortParams = () => {
    setSearchParams((prevState) => {
      prevState.delete("sortOrder");
      prevState.delete("sortBy");
      return new URLSearchParams(prevState);
    });
    setSortBy(null);
    setCurrentSearch(null);
  };

  return (
    <div className="sort-by">
      <div className="sort-by__content">
        {Object.entries(options).map(([key, value]) => {
          return (
            <div>
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
