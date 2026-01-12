import { Button } from "@components/ui";
import React, { JSX, useEffect, useRef } from "react";

import { useSearchParams } from "react-router-dom";

interface UrlParamsInputProps {
  children: React.ReactNode;
  onClickClear?: () => void;
  type?: "horizontal" | "vertical";
}

export default function UrlParamsInput({
  children,
  onClickClear,
  type = "horizontal",
}: UrlParamsInputProps): JSX.Element {
  const CUSTOM_PARAMETER = "queryparam";

  const [searchParams, setSearchParams] = useSearchParams();

  const inputsWrapper = useRef<HTMLDivElement>(null);

  const clearFilters = () => {
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
    const childrensWrapper = inputsWrapper.current;
    if (childrensWrapper) {
      const allInputs = [...childrensWrapper.querySelectorAll("input")];
      for (let i = 0; i < allInputs.length; i++) {
        const currentChild = allInputs[i] as HTMLInputElement;
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
  }, [searchParams, setSearchParams]);

  return (
    <div className="url-params-inputs-wrapper">
      <Button
        variant="danger"
        size="small"
        className="filter-clear-btn"
        onClick={() => {
          clearFilters();
          onClickClear?.();
        }}
      >
        Clear filters
      </Button>
      <div
        className={`filter-inputs ${
          type === "horizontal" ? "horizontal" : "vertical"
        }`}
        ref={inputsWrapper}
      >
        {children}
      </div>
    </div>
  );
}
