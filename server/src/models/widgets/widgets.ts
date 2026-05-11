import { nameField } from "@utils";
import { Model, model, Schema } from "mongoose";
import { WidgetsDocument } from "./types";
import { LayoutBreakpointSchema } from "../layouts/schemas";

const WidgetsModel: Schema<WidgetsDocument> = new Schema(
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
    }
  },
  { timestamps: true }
);

export const Widgets: Model<WidgetsDocument> = model("Widgets", WidgetsModel);
