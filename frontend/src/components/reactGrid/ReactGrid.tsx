import React, { JSX, useCallback, useEffect, useState } from "react";
import {
  Layout,
  LayoutItem,
  Responsive,
  ResponsiveLayouts,
  WidthProvider,
} from "react-grid-layout/legacy";
import NavigateButton from "@components/navigateButton";
import { getDefaultBreakpoints, getDefaultCols } from "@utils";
import { Button } from "@components/ui/button";
import Modal from "@components/modal";
import LayoutItems from "./LayoutItems";

type CurrentBreakpointState = [
  string,
  React.Dispatch<React.SetStateAction<string>>,
];

interface ReactGridProps {
  layoutName: string;
  layoutState: ResponsiveLayouts;
  toolboxState: ResponsiveLayouts;
  currentBreakpointState: CurrentBreakpointState;
  componentsMap: Map<string, () => JSX.Element | null>;
  onEdit: (layout: ResponsiveLayouts, toolbox: ResponsiveLayouts) => void;
  showMenu?: boolean;
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);

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
      setLayout((prevLayout) => {
        const currentLayoutBreakpoint = prevLayout[currentBreakpoint];
        if (!currentLayoutBreakpoint) return prevLayout;
        return {
          ...prevLayout,
          [currentBreakpoint]: currentLayoutBreakpoint.map((item) => ({
            ...item,
            isDraggable: !editable,
            isResizable: !editable,
          })),
        };
      });
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

  const onLayoutChange = (currLayout: Layout) => {
    setLayout((prevLayouts) => ({
      ...prevLayouts,
      [currentBreakpoint]: currLayout,
    }));
  };

  const onBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
    setToolbox((prevToolbox) => {
      const breakpointState =
        prevToolbox[breakpoint] || prevToolbox.currentBreakpoint || [];
      return {
        ...prevToolbox,
        [breakpoint]: breakpointState,
      };
    });
  };

  const onPutItem = (item: LayoutItem) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [currentBreakpoint]: [...(prevToolbox[currentBreakpoint] || []), item],
    }));

    setLayout((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: prevLayout[currentBreakpoint]?.filter(
        ({ i }) => i !== item.i,
      ),
    }));
  };

  const onTakeItem = (item: LayoutItem) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [currentBreakpoint]: prevToolbox[currentBreakpoint]?.filter(
        ({ i }) => i !== item.i,
      ),
    }));

    setLayout((prevLayout) => {
      const prevLayoutCurrent = prevLayout[currentBreakpoint];
      if (!prevLayoutCurrent) return prevLayout;
      return {
        ...prevLayout,
        [currentBreakpoint]: [...prevLayoutCurrent, item],
      };
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
        {LayoutItems({
          layout,
          currentBreakpoint,
          isEdit,
          onPutItem,
          componentsMap,
        })}
      </ResponsiveReactGridLayout>
    </div>
  );
}

const ToolBox = (props: {
  items: Layout;
  onTakeItem: (item: LayoutItem) => void;
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
  item: LayoutItem;
  onTakeItem: (item: LayoutItem) => void;
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
  toolbox: ResponsiveLayouts;
  currentBreakpoint: string;
  onTakeItem: (item: LayoutItem) => void;
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
