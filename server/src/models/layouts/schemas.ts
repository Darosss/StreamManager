import z from "zod";

export const LayoutBreakpointSchema = z.object({
  i: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  static: z.boolean(),
  isDraggable: z.boolean(),
  isResizable: z.boolean()
});
