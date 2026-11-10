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
  currentPage: defaultPage = 1,
  localStorageName,
  className,
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pageSizeT, setPageSize] = useLocalStorage<number>(
    localStorageName || DEFUALT_LOCAL_STORAGE_NAME,
    15,
  );
  const limit = Number(searchParams.get("limit")) || pageSizeT;
  const rawPage = Number(searchParams.get("page")) || defaultPage;

  const paginationRange = usePagination(
    totalCount,
    limit,
    siblingCount,
    rawPage,
  );

  const maxPage = Number(paginationRange?.[paginationRange.length - 1] ?? 1);
  const currentPage = Math.min(rawPage, maxPage);

  const updateParams = (updates: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [k, v] of Object.entries(updates)) next.set(k, v);
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page: String(page) });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    updateParams({ limit: String(size), page: "1" });
  };

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
    handlePageChange(currentPage + 1);
  };

  const onPrevious = () => {
    handlePageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="pagination-wrapper">
      <ul className={`pagination-container ${className || ""}`}>
        <li
          className={`pagination-item ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => (currentPage > 1 ? onPrevious() : "")}
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
                handlePageChange(Number(pageNumber) || 1);
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
        <PageSizeSelect pageSize={limit} onSetPageSize={handlePageSizeChange} />
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
