import type { Client } from "server/dist/src/client";
import { hcWithType } from "server/dist/src/client";

export type JsonFrom<R extends PromiseLike<{ json(): Promise<unknown> }>> = Awaited<
    ReturnType<Awaited<R>["json"]>
>;

const baseUrl = (import.meta.env.VITE_SERVER_URL as string) || "https://api.canthus.org";

export const client: Client = hcWithType(baseUrl, {
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, credentials: "include" }),
});
