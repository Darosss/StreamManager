interface PageSizeSelectProps {
  pageSize: number;
  onSetPageSize: (value: number) => void;
}

export default function PageSizeSelect({
  pageSize,
  onSetPageSize,
}: PageSizeSelectProps) {
  return (
    <select
      name="page-size"
      className="page-size common-button primary-button"
      value={pageSize}
      onChange={(e) => {
        onSetPageSize(Number(e.target.value));
      }}
    >
      <option value={pageSize}>{pageSize}</option>
      <option value={5}>5</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
      <option value={500}>500</option>
    </select>
  );
}
