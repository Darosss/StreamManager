import Pagination, { PaginationProps } from "@components/pagination/Pagination";
import { Button } from "@components/ui/button";

interface CardboxCommonProps {
  title: string;
  children: React.ReactNode;
  paginationProps?: PaginationProps;
}

interface CardboxItemProps extends CardboxCommonProps {
  onClickX?: () => void | unknown;
}

export default function CardboxWrapper({
  title,
  children,
  paginationProps,
}: CardboxCommonProps) {
  return (
    <div className="cardbox-wrapper">
      <div className="cardbox-header">{title}</div>
      <div className="cardbox-list">{children}</div>
      {paginationProps && (
        <div className="cardbox-pagination">
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

export function CardboxItem({ title, children, onClickX }: CardboxItemProps) {
  return (
    <>
      <div className="cardbox-item common-card">
        <div className="cardbox-title">{title}</div>
        <div className="cardbox-content">
          {children}
          {onClickX ? (
            <Button
              onClick={onClickX}
              variant="danger"
              className="remove-cardbox-btn"
            >
              X
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
}
