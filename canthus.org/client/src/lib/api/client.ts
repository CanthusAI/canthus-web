import type { Client } from "server/dist/src/client";
import { hcWithType } from "server/dist/src/client";
import { getApiBaseUrl, logger } from "@/lib/env/client-env";

export type JsonFrom<R extends PromiseLike<{ json(): Promise<unknown> }>> = Awaited<
    ReturnType<Awaited<R>["json"]>
>;

// Get validated API base URL
const baseUrl = getApiBaseUrl();

logger.info('API client initialized', {
    component: 'ApiClient',
    baseUrl,
    environment: import.meta.env.NODE_ENV || 'development'
});

export const client: Client = hcWithType(baseUrl, {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        logger.debug('API request initiated', {
            component: 'ApiClient',
            url: input.toString(),
            method: init?.method || 'GET'
        });

        return fetch(input, { ...init, credentials: "include" });
    },
});
