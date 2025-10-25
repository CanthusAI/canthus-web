import { hc } from "hono/client";
import type { createApp } from "./index";

export type AppType = ReturnType<typeof createApp>;
export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);