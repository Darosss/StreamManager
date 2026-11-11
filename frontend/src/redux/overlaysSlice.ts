import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LayoutItem, ResponsiveLayouts } from "react-grid-layout";
import {
  initialLayoutOverlays,
  initialStylesState,
  initialToolboxOverlays,
  OverlayKeysStylesParsedType,
  parseOverlayKeysType,
  stringifyOverlayKeysType,
} from "@layout";
import { OverlayCreateData } from "@services";

export interface BaseData {
  _id: string;
  styles: OverlayKeysStylesParsedType;
}

export interface OverlaysSliceType {
  overlay: OverlayCreateData;
  isEditor: boolean;
  baseData: BaseData;
}

export interface SetCurrentLayout {
  breakpoint: string;
  layout: ResponsiveLayouts;
}

export interface SetLayoutOnBreakpointChange {
  newBreakpoint: string;
  previousBreakpoint: string;
}

export interface SetLayoutOnTakePutItem {
  currentBreakpoint: string;
  item: LayoutItem;
}

export interface SetEditableInLayout {
  edit: boolean;
  currentBreakpoint: string;
}

const initialState: OverlaysSliceType = {
  overlay: {
    name: "",
    layout: initialLayoutOverlays,
    toolbox: initialToolboxOverlays,
    styles: stringifyOverlayKeysType(initialStylesState),
  },
  baseData: {
    _id: "",
    styles: initialStylesState,
  },
  isEditor: false,
};

const overlaysSlice = createSlice({
  name: "overlays",
  initialState,
  reducers: {
    setIsEditor(state, action: PayloadAction<boolean>) {
      state.isEditor = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.overlay.name = action.payload;
    },
    setId(state, action: PayloadAction<string>) {
      state.baseData._id = action.payload;
    },
    setLayout(state, action: PayloadAction<OverlayCreateData["layout"]>) {
      state.overlay.layout = action.payload;
    },

    setToolbox(state, action: PayloadAction<OverlayCreateData["toolbox"]>) {
      state.overlay.toolbox = action.payload;
    },
    setStyles(state, action: PayloadAction<OverlayKeysStylesParsedType>) {
      state.overlay.styles = stringifyOverlayKeysType(action.payload);

      state.baseData.styles = action.payload;
    },
    setOverlayState(state, action: PayloadAction<OverlayCreateData>) {
      return {
        ...state,
        overlay: action.payload,
        baseData: {
          ...state.baseData,
          styles: action.payload.styles
            ? parseOverlayKeysType(action.payload.styles)
            : initialStylesState,
        },
      };
    },
    resetOverlayState() {
      return { ...initialState };
    },
    resetState() {
      return initialState;
    },
  },
});

export const {
  setIsEditor,
  setName,
  setLayout,
  setToolbox,
  resetOverlayState,
  resetState,
  setOverlayState,
  setId,
  setStyles,
} = overlaysSlice.actions;

export default overlaysSlice.reducer;
