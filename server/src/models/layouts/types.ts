import z from "zod";
import { LayoutBreakpointSchema } from "./schemas";

export type LayoutBreakpointModel = z.infer<typeof LayoutBreakpointSchema>;
