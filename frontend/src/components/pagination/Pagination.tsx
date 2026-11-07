import { useEffect, useState } from "react";

import { usePagination, DOTS, useLocalStorage } from "@hooks";
import { useSearchParams } from "react-router";
import PageSizeSelect from "./PageSizeSelect";

export interface PaginationProps {
  totalCount?: number;
  siblingCount?: number;
  currentPage?: number;
  localStorageName?: string;
  className?: string;
}

const DEFUALT_LOCAL_STORAGE_NAME = "pagination-default";
export default function Pagination({
  totalCount = 1,
  siblingCount = 1,
  currentPage = 1,
  localStorageName,
  className,
}: PaginationProps) {
  const [, setSearchParams] = useSearchParams();

  const [pageSizeT, setPageSize] = useLocalStorage<number>(
    localStorageName || DEFUALT_LOCAL_STORAGE_NAME,
    15,
  );
  const [currentPageLoc, setCurrentPageLoc] = useState<number>(currentPage);

  const onPageChangeSearchParam = (value: string) => {
    setSearchParams((prevState) => {
      prevState.set("page", value);
      return prevState;
    });
  };

  useEffect(() => {
    setSearchParams((prevState) => {
      prevState.set("limit", String(pageSizeT));
      return prevState;
    });
    // Unnecessary rendering
  }, [pageSizeT]);

  useEffect(() => {
    const checkIfPageIsTooBigAndSet = () => {
      if (!paginationRange) return;

      if (currentPageLoc - 1 > paginationRange.length) {
        setCurrentPageLoc(Number(paginationRange[paginationRange.length - 1]));
      }
    };

    checkIfPageIsTooBigAndSet();
    setSearchParams((prevState) => {
      prevState.set("page", String(currentPageLoc));
      return prevState;
    });
    // Unnecessary rendering
  }, [currentPageLoc]);

  const paginationRange = usePagination(
    totalCount,
    pageSizeT,
    siblingCount,
    currentPageLoc,
  );

  if (!paginationRange) {
    return (
      <div className="pagination-wrapper">
        Page size
        <PageSizeSelect pageSize={pageSizeT} onSetPageSize={setPageSize} />
      </div>
    );
  }

  if (currentPage === 0 || paginationRange.length < 2) {
    return (
      <div className="pagination-wrapper">
        <TotalResults totalCount={totalCount} />
        <div className="page-size-single">
          <label>Page size</label>
          <PageSizeSelect pageSize={pageSizeT} onSetPageSize={setPageSize} />
        </div>
      </div>
    );
  }

  const onNext = () => {
    onPageChangeSearchParam(String(currentPageLoc + 1));
  };

  const onPrevious = () => {
    onPageChangeSearchParam(String(currentPageLoc - 1));
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="pagination-wrapper">
      <ul className={`pagination-container ${className || ""}`}>
        <li
          className={`pagination-item ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => (currentPageLoc > 1 ? onPrevious() : "")}
        >
          <div className="arrow left" />
        </li>
        {paginationRange.map((pageNumber) => {
          if (pageNumber === DOTS) {
            return (
              <li key={pageNumber} className="pagination-item dots">
                &#8230;
              </li>
            );
          }
          return (
            <li
              key={pageNumber}
              className={`pagination-item ${
                pageNumber === currentPage ? "selected" : ""
              }`}
              onClick={() => {
                onPageChangeSearchParam(String(pageNumber));
              }}
            >
              {pageNumber}
            </li>
          );
        })}

        <li
          className={`pagination-item ${
            currentPage === lastPage ? "disabled" : ""
          }`}
          onClick={() => (currentPageLoc < Number(lastPage) ? onNext() : "")}
        >
          <div className="arrow right" />
        </li>
        <PageSizeSelect pageSize={pageSizeT} onSetPageSize={setPageSize} />
        <TotalResults totalCount={totalCount} />
      </ul>
    </div>
  );
}
interface TotalResultsProps {
  totalCount: number;
}
function TotalResults({ totalCount }: TotalResultsProps) {
  return (
    <div className="total-count">
      Results: <span>{totalCount}</span>
    </div>
  );
}
