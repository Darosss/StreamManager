import React, { JSX, useCallback, useEffect, useMemo, useState } from "react";
import ReactGridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import NavigateButton from "@components/navigateButton";
import { getDefaultBreakpoints, getDefaultCols } from "@utils";
import { Button } from "@components/ui/button";
import Modal from "@components/modal";

type CurrentBreakpointState = [
  string,
  React.Dispatch<React.SetStateAction<string>>,
];

interface ReactGridProps {
  layoutName: string;
  layoutState: ReactGridLayout.Layouts;
  toolboxState: ReactGridLayout.Layouts;
  currentBreakpointState: CurrentBreakpointState;
  componentsMap: Map<string, () => JSX.Element | null>;
  onEdit: (
    layout: ReactGridLayout.Layouts,
    toolbox: ReactGridLayout.Layouts,
  ) => void;
  showMenu?: boolean;
}

export default function ReactGrid({
  layoutName,
  layoutState,
  toolboxState,
  currentBreakpointState,
  componentsMap,
  onEdit,
  showMenu = true,
}: ReactGridProps) {
  const [layout, setLayout] = useState(layoutState);
  const [toolbox, setToolbox] = useState(toolboxState);
  const [currentBreakpoint, setCurrentBreakpoint] = currentBreakpointState;
  const [isEdit, setIsEdit] = useState(false);
  const setEditableInLayout = useCallback(
    (editable: boolean) => {
      setLayout((prevLayout) => ({
        ...prevLayout,
        [currentBreakpoint]: prevLayout[currentBreakpoint].map((item) => ({
          ...item,
          isDraggable: !editable,
          isResizable: !editable,
        })),
      }));
    },
    [currentBreakpoint],
  );
  const toggleEdit = useCallback(() => {
    setEditableInLayout(isEdit);

    setIsEdit((prevState) => {
      return !prevState;
    });
  }, [isEdit, setEditableInLayout]);

  useEffect(() => {
    const keyboardSave = (e: KeyboardEvent) => {
      console.log(e, e.ctrlKey, e.code);

      if (!e.ctrlKey) return;
      e.preventDefault();
      if (e.code === "KeyS") {
        onEdit(layout, toolbox);
      }
      if (e.code === "KeyE") {
        toggleEdit();
      }
    };
    window.addEventListener("keydown", keyboardSave);

    return () => {
      window.removeEventListener("keydown", keyboardSave);
    };
  }, [layout, onEdit, toggleEdit, toolbox]);

  useEffect(() => {
    setLayout({ ...layoutState });
  }, [layoutState]);

  useEffect(() => {
    setToolbox({ ...toolboxState });
  }, [toolboxState]);

  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    [],
  );

  const onLayoutChange = (currLayout: ReactGridLayout.Layout[]) => {
    setLayout((prevLayouts) => ({
      ...prevLayouts,
      [currentBreakpoint]: currLayout,
    }));
  };

  const onBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [breakpoint]:
        prevToolbox[breakpoint] || [prevToolbox.currentBreakpoint] || [],
    }));
  };

  const onPutItem = (item: ReactGridLayout.Layout) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [currentBreakpoint]: [...(prevToolbox[currentBreakpoint] || []), item],
    }));

    setLayout((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: prevLayout[currentBreakpoint].filter(
        ({ i }) => i !== item.i,
      ),
    }));
  };

  const onTakeItem = (item: ReactGridLayout.Layout) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [currentBreakpoint]: prevToolbox[currentBreakpoint].filter(
        ({ i }) => i !== item.i,
      ),
    }));

    setLayout((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: [...prevLayout[currentBreakpoint], item],
    }));
  };

  const generateLayoutItems = () => {
    return layout[currentBreakpoint].map((item) => {
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
  };

  return (
    <div>
      {showMenu ? (
        <LayoutMenuActions
          layoutName={layoutName}
          toolbox={toolbox}
          currentBreakpoint={currentBreakpoint}
          onTakeItem={onTakeItem}
          isEdit={isEdit}
          toggleEdit={toggleEdit}
          editFn={() => onEdit(layout, toolbox)}
        />
      ) : null}

      <ResponsiveReactGridLayout
        onLayoutChange={onLayoutChange}
        style={{ marginRight: "1rem" }}
        compactType={null}
        layouts={layout}
        onBreakpointChange={onBreakpointChange}
        breakpoints={getDefaultBreakpoints}
        rowHeight={5}
        cols={getDefaultCols}
        preventCollision={true}
        allowOverlap={true}
        containerPadding={{
          lg: [12, 12],
          md: [8, 8],
          sm: [6, 6],
          xs: [4, 4],
          xxs: [2, 2],
        }}
      >
        {generateLayoutItems()}
      </ResponsiveReactGridLayout>
    </div>
  );
}

const ToolBox = (props: {
  items: ReactGridLayout.Layout[];
  onTakeItem: (item: ReactGridLayout.Layout) => void;
}) => {
  const { items, onTakeItem } = props;
  return (
    <>
      <div className="grid-toolbox-title">Available grid items</div>
      <div className="grid-toolbox">
        <div className="grid-toolbox-items">
          {items.map((item) => (
            <ToolBoxItem key={item.i} item={item} onTakeItem={onTakeItem} />
          ))}
        </div>
      </div>
    </>
  );
};

const ToolBoxItem = (props: {
  item: ReactGridLayout.Layout;
  onTakeItem: (item: ReactGridLayout.Layout) => void;
}) => {
  const { item, onTakeItem } = props;
  return (
    <div className="grid-items-item" onClick={onTakeItem.bind(undefined, item)}>
      {item.i.replace("-", " ")}
    </div>
  );
};

function LayoutMenuActions(props: {
  layoutName: string;
  toolbox: ReactGridLayout.Layouts;
  currentBreakpoint: string;
  onTakeItem: (item: ReactGridLayout.Layout) => void;
  isEdit: boolean;
  toggleEdit: () => void;
  editFn: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    layoutName,
    toolbox,
    currentBreakpoint,
    onTakeItem,
    toggleEdit,
    editFn,
    isEdit,
  } = props;

  return (
    <>
      <div className="grid-menu--actions-wrapper">
        <Button onClick={() => setIsMenuOpen(true)}> Menu </Button>
      </div>
      <Modal
        title="Overlay actions"
        show={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <div className="grid-menu">
          <div className="base-header-wrapper grid-menu__header">
            <NavigateButton />
            <div className="grid-menu__edit-actions">
              <div>
                <Button
                  variant={isEdit ? "danger" : "primary"}
                  onClick={toggleEdit}
                >
                  Turn edit {isEdit ? "off" : "on"}
                </Button>
              </div>
              <div>
                <Button variant="success" onClick={editFn}>
                  Save
                </Button>
              </div>
            </div>
          </div>
          <div className="grid-menu__info-wrapper">
            <div>
              Name: <span>{layoutName}</span>
            </div>{" "}
            <div>
              Current breakpoint: <span>{currentBreakpoint}</span>
            </div>
          </div>

          <div className="grid-menu__toolbox">
            <ToolBox
              items={toolbox[currentBreakpoint] || []}
              onTakeItem={onTakeItem}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
