import { ResponsiveLayouts } from "react-grid-layout";
import { BaseModelProperties, DefaultRequestParams } from "../api";

export interface Widget extends BaseModelProperties {
  name: string;
  layout: ResponsiveLayouts;
  toolbox: ResponsiveLayouts;
}

export interface WidgetCreateData extends Pick<
  Widget,
  "name" | "layout" | "toolbox"
> {}

export interface WidgetUpdateData extends Partial<WidgetCreateData> {}

export interface FetchWidgetsParams extends DefaultRequestParams<keyof Widget> {
  search_name?: string;
}
