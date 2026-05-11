import { Document } from "mongoose";
import { BaseModel } from "../types";
import { LayoutBreakpointModel } from "models/layouts";

export interface OverlayModel extends BaseModel {
  name: string;
  layout: { [P: string]: LayoutBreakpointModel[] };
  toolbox: { [P: string]: LayoutBreakpointModel[] };
  styles?: Map<string, string>;
}

export type OverlayDocument = OverlayModel & Document;
