import { Model, model, Schema } from "mongoose";
import { OverlayDocument } from "./types";
import { nameField } from "@utils";
import { LayoutBreakpointSchema } from "../layouts";

const OverlaySchema: Schema<OverlayDocument> = new Schema(
  {
    ...nameField,
    layout: {
      type: Map,
      of: [LayoutBreakpointSchema],
      default: new Map()
    },
    toolbox: {
      type: Map,
      of: [LayoutBreakpointSchema],
      default: new Map()
    },
    styles: {
      type: Map,
      of: String,
      default: new Map()
    }
  },
  { timestamps: true }
);

export const Overlay: Model<OverlayDocument> = model("Overlays", OverlaySchema);
