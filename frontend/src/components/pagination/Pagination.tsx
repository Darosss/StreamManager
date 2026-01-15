import { useEffect, useState } from "react";

import { usePagination, DOTS, useLocalStorage } from "@hooks";
import { useSearchParams } from "react-router";

export interface PaginationProps {
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  localStorageName: string;
  className?: string;
}

export default function Pagination({
  totalCount,
  siblingCount,
  currentPage,
  localStorageName,
  className,
}: PaginationProps) {
  const [, setSearchParams] = useSearchParams();

  const [pageSizeT, setPageSize] = useLocalStorage<number>(
    localStorageName,
    15
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageLoc]);

  const paginationRange = usePagination(
    totalCount,
    pageSizeT,
    siblingCount,
    currentPage
  );

  const PageSizeSelect = () => {
    return (
      <select
        name="page-size"
        className="page-size common-button primary-button"
        value={pageSizeT}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        <option value={pageSizeT}>{pageSizeT}</option>
        <option value={5}>5</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={500}>500</option>
      </select>
    );
  };

  const TotalResults = () => {
    return (
      <div className="total-count">
        Results: <span>{totalCount}</span>
      </div>
    );
  };

  if (!paginationRange) {
    return (
      <div className="pagination-wrapper">
        Page size
        <PageSizeSelect />
      </div>
    );
  }

  if (currentPage === 0 || paginationRange.length < 2) {
    return (
      <div className="pagination-wrapper">
        <TotalResults />
        <div className="page-size-single">
          <label>Page size</label>
          <PageSizeSelect />
        </div>
      </div>
    );
  }

  const onNext = () => {
    onPageChangeSearchParam(String(currentPage + 1));
  };

  const onPrevious = () => {
    onPageChangeSearchParam(String(currentPage - 1));
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="pagination-wrapper">
      <ul className={`pagination-container ${className || ""}`}>
        <li
          className={`pagination-item ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => (currentPage > 1 ? onPrevious() : "")}
        >
          <div className="arrow left" />
        </li>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <li key={pageNumber + index} className="pagination-item dots">
                &#8230;
              </li>
            );
          }
          return (
            <li
              key={index}
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
          onClick={() => (currentPage < Number(lastPage) ? onNext() : "")}
        >
          <div className="arrow right" />
        </li>
        <PageSizeSelect />
        <TotalResults />
      </ul>
    </div>
  );
}
