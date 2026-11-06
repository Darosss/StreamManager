import { LayoutItem } from "react-grid-layout";
import { BaseModelProperties, DefaultRequestParams } from "../api";

interface OverlayStylesType {
  overlayRedemptions: string;
  overlayMusicPlayer: string;
  overlayAchievements: string;
  overlayChat: string;
}

export interface Overlay extends BaseModelProperties {
  name: string;
  layout: Record<string, LayoutItem[]>;
  toolbox: Record<string, LayoutItem[]>;
  styles?: OverlayStylesType;
}
export interface OverlayCreateData extends Pick<
  Overlay,
  "name" | "layout" | "toolbox" | "styles"
> {}

export interface OverlaysUpdateData extends Partial<OverlayCreateData> {}

export interface FetchOverlaysParams extends DefaultRequestParams<
  keyof Overlay
> {
  search_name?: string;
}
