import Pagination from "@components/pagination";
import { PaginationProps } from "@components/pagination/Pagination";
import React from "react";

interface TableListWrapperProps {
  theadChildren: React.ReactNode;
  tbodyChildren: React.ReactNode;
  className?: string;
}

export default function TableListWrapper({
  theadChildren,
  tbodyChildren,
  className,
}: TableListWrapperProps) {
  return (
    <div className={`table-list-wrapper ${className}`}>
      <table className="table-list">
        <thead>{theadChildren}</thead>
        <tbody>{tbodyChildren}</tbody>
      </table>
    </div>
  );
}

interface TableListProps {
  children: React.ReactNode;
  paginationProps?: PaginationProps;
}
export function TableList({ children, paginationProps }: TableListProps) {
  return (
    <div className="table-list-wrapper">
      <div className="table-list-data">{children}</div>

      {paginationProps && (
        <div className="table-list-footer">
          <Pagination
            className={`${paginationProps.className || ""} "pagination-bar"`}
            localStorageName={paginationProps.localStorageName}
            currentPage={paginationProps.currentPage}
            totalCount={paginationProps.totalCount}
            siblingCount={paginationProps.siblingCount}
          />
        </div>
      )}
    </div>
  );
}
