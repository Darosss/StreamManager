import { LayoutBreakpointSchema } from "../layouts/schemas";
import z from "zod";

export const OverlaySchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1, "Overlay name must be at least 1 length"),
  layout: z.record(z.string(), z.array(LayoutBreakpointSchema)),
  toolbox: z.record(z.string(), z.array(LayoutBreakpointSchema)),
  styles: z.record(z.string(), z.string()).optional()
});

export const OverlayUpdateSchema = OverlaySchema.omit({ _id: true, createdAt: true, updatedAt: true }).partial();
export const OverlayCreateSchema = OverlayUpdateSchema.required({ name: true, layout: true, toolbox: true });
