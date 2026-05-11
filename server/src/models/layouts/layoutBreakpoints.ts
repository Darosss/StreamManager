import { Schema } from "mongoose";
import { LayoutBreakpointModel } from "./types";

export const LayoutBreakpointSchema = new Schema<LayoutBreakpointModel>({
  i: String,
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  static: Boolean,
  isDraggable: Boolean,
  isResizable: Boolean
});
