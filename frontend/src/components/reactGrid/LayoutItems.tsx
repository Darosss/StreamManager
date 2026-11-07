import { Layout, LayoutItem } from "react-grid-layout/legacy";
import { JSX } from "react/jsx-runtime";

interface LayoutItemsProps {
  layout: Partial<Record<string, Layout>>;
  currentBreakpoint: string;
  isEdit: boolean;
  onPutItem: (item: LayoutItem) => void;
  componentsMap: Map<string, () => JSX.Element | null>;
}
export default function LayoutItems({
  layout,
  currentBreakpoint,
  isEdit,
  onPutItem,
  componentsMap,
}: LayoutItemsProps) {
  return layout[currentBreakpoint]?.map((item) => {
    const MapComponent = componentsMap.get(item.i);
    if (!MapComponent) return null;
    return (
      <div key={item.i} className={`${isEdit ? "react-grid-item-edit" : ""}`}>
        {isEdit ? (
          <>
            <div
              className="grid-hide-button common-button"
              onClick={() => onPutItem(item)}
            >
              &times;
            </div>

            <div className="grid-name-div"> {item.i} </div>
          </>
        ) : null}
        <span>
          <MapComponent />
        </span>
      </div>
    );
  });
}
