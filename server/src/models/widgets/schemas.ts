import { LayoutBreakpointSchema } from "../layouts/schemas";
import z from "zod";

export const WidgetsSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1, "Widget name must be at least 1 length"),
  layout: z.record(z.string(), z.array(LayoutBreakpointSchema)),
  toolbox: z.record(z.string(), z.array(LayoutBreakpointSchema))
});

export const WidgetsUpdateSchema = WidgetsSchema.omit({ _id: true, createdAt: true, updatedAt: true }).partial();
export const WidgetsCreateSchema = WidgetsUpdateSchema.required({ name: true, layout: true, toolbox: true });
