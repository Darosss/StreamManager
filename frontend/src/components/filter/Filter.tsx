import Modal from "@components/modal";
import { Button } from "@components/ui";
import UrlParamsInputs, { FilterBarInput } from "@components/urlParamsInputs";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

type PossibleCommonFields = "start_date" | "end_date" | "search_name";

type OptionsValue = InputHTMLAttributes<HTMLInputElement>;

export type Options<T extends string> = Record<
  T & PossibleCommonFields,
  OptionsValue
>;

const possibleCommonFields: Options<PossibleCommonFields> = {
  end_date: { type: "datetime-local", placeholder: "End date" },
  start_date: { type: "datetime-local", placeholder: "Start date" },
  search_name: { type: "search", placeholder: "Message" },
};

export const getPossibleCommonField = (field: PossibleCommonFields) => ({
  [field]: possibleCommonFields[field],
});
interface FilterProps<OptionsKeys extends string> {
  options: Options<OptionsKeys>;
}

export type Filters<OptionsKeys extends string> = Record<OptionsKeys, string>;
export default function Filter<OptionsKeys extends string>({
  options,
}: FilterProps<OptionsKeys>) {
  const [showModal, setShowModal] = useState(false);
  const [currentFilters, setCurrentFilters] =
    useState<Filters<OptionsKeys> | null>(null);
  const appliedFilters = currentFilters
    ? Object.keys(currentFilters).length
    : 0;
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const newFilters = {} as Filters<OptionsKeys>;
    for (const key of Object.keys(options)) {
      if (!searchParams.has(key)) continue;

      newFilters[key as OptionsKeys] = searchParams.get(key)!;
    }

    setCurrentFilters(newFilters);
  }, [options, searchParams]);
  return (
    <div>
      <Button size="small" onClick={(e) => setShowModal(true)}>
        <div>Filter {!!appliedFilters && `(${appliedFilters})`}</div>
      </Button>
      <Modal
        title={"Filters"}
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <div className="filter-modal-data">
          <UrlParamsInputs
            onClickClear={() => setCurrentFilters(null)}
            type="vertical"
          >
            {Object.entries(options).map(([name, props]) => {
              const propsAs = props as OptionsValue;
              const nameAs = name as OptionsKeys;

              return (
                <div key={name} className="filter-input-wrapper">
                  <div> {name} </div>

                  <FilterBarInput
                    {...propsAs}
                    queryparam={name}
                    value={propsAs.value || currentFilters?.[nameAs] || ""}
                    onChange={(e) => {
                      if (propsAs.onChange) propsAs.onChange(e);

                      setCurrentFilters((prevState) => {
                        const nextEntry = {
                          [nameAs]: e.target.value,
                        } as Filters<OptionsKeys>;
                        if (!prevState) return nextEntry;
                        return {
                          ...prevState,
                          ...nextEntry,
                        };
                      });
                    }}
                  />
                </div>
              );
            })}
          </UrlParamsInputs>
        </div>
      </Modal>
    </div>
  );
}
