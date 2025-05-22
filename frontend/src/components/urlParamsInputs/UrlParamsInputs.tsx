import React, { JSX, useEffect, useRef } from "react";

import { useSearchParams } from "react-router-dom";

interface UrlParamsInputProps {
  children: React.ReactNode;
}

/**
 * @param {ReactElement} props - react element props
 * @param {React.ReactNode} props.children - inputs, select or sth should have 'queryparam' custom parameter
 * @example ```
 * <UrlParamsInputs>
 *     <FilterBarInput queryparam="search_name" type="search" placeholder="Username"/>
 * </UrlParamsInputs>```
 * @returns - children wrapped in UrlParamsInputs which now they change UrlSearchParam
 */
export default function UrlParamsInput({
  children,
}: UrlParamsInputProps): JSX.Element {
  const CUSTOM_PARAMETER = "queryparam";

  const [searchParams, setSearchParams] = useSearchParams();

  const inputsWrapper = useRef<HTMLDivElement>(null);

  const clearFilters = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setSearchParams("");
  };

  useEffect(() => {
    const onKeyDownInput = (
      key: string,
      queryString: string,
      value: string
    ) => {
      if (key === "Enter") {
        onBlurOrKeySearchParamsChange(queryString, value);
      }
    };
    const onBlurOrKeySearchParamsChange = (
      queryName?: string,
      value?: string
    ) => {
      setSearchParams((prevState) => {
        if (queryName) {
          if (value) {
            prevState.set(queryName, value);
          } else {
            prevState.delete(queryName);
          }
        }
        return prevState;
      });
    };
    const childrensWrapper = inputsWrapper.current?.children;
    if (childrensWrapper) {
      for (let i = 0; i < childrensWrapper.length; i++) {
        if (childrensWrapper[i].tagName !== "INPUT") continue;

        const currentChild = childrensWrapper[i] as HTMLInputElement;
        const childParameter = currentChild.getAttribute(CUSTOM_PARAMETER);
        if (!childParameter) return;

        currentChild.value = searchParams.get(childParameter) || "";

        currentChild.onblur = function () {
          onBlurOrKeySearchParamsChange(childParameter, currentChild.value);
        };
        currentChild.onkeydown = function (e) {
          onKeyDownInput(e.key, childParameter, currentChild.value);
        };
      }
    }
  }, [children, searchParams, setSearchParams]);

  return (
    <div className="filter-wrapper">
      <button
        className="filter-clear-btn common-button danger-button"
        onClick={(e) => {
          clearFilters(e);
        }}
      >
        Clear filters
      </button>
      <div className="filter-inputs" ref={inputsWrapper}>
        {children}
      </div>
    </div>
  );
}
