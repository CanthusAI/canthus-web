import { useCallback, useMemo, useState } from "react";
import { client } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Endpoint = {
    key: string;
    label: string;
    handler: () => Promise<{ status: number; body: string; contentType?: string | null }>
}

export default function ApiClientPanel() {
    const [, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<number | null>(null);
    const [body, setBody] = useState<string>("");
    const [selected, setSelected] = useState<string | null>(null);

    const endpoints: Endpoint[] = useMemo(() => [
        {
            key: "hello",
            label: "GET /hello",
            handler: async () => {
                const res = await client.hello.$get();
                const contentType = res.headers.get("content-type");
                const text = contentType?.includes("application/json") ? JSON.stringify(await res.json(), null, 2) : await res.text();
                return { status: res.status, body: text, contentType };
            },
        },
        {
            key: "auth-me",
            label: "GET /auth/me",
            handler: async () => {
                const res = await client.auth.me.$get();
                const contentType = res.headers.get("content-type");
                const text = contentType?.includes("application/json") ? JSON.stringify(await res.json(), null, 2) : await res.text();
                return { status: res.status, body: text, contentType };
            },
        },
        {
            key: "auth-orgs",
            label: "GET /auth/organizations",
            handler: async () => {
                const res = await client.auth.organizations.$get();
                const contentType = res.headers.get("content-type");
                const text = contentType?.includes("application/json") ? JSON.stringify(await res.json(), null, 2) : await res.text();
                return { status: res.status, body: text, contentType };
            },
        },
        {
            key: "protected",
            label: "GET /protected",
            handler: async () => {
                const res = await client.protected.$get();
                const contentType = res.headers.get("content-type");
                const text = contentType?.includes("application/json") ? JSON.stringify(await res.json(), null, 2) : await res.text();
                return { status: res.status, body: text, contentType };
            },
        },
    ], []);

    const callEndpoint = useCallback(async (ep: Endpoint) => {
        setSelected(ep.key);
        setLoading(true);
        setBody("");
        setStatus(null);
        try {
            const res = await ep.handler();
            setStatus(res.status);
            setBody(res.body);
        } catch (err) {
            setStatus(0);
            setBody(String(err));
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <Card className="w-[min(95vw,900px)] shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>API Client</CardTitle>
                <div className="flex items-center gap-2">
                    {status !== null && (
                        <span className={`text-xs px-2 py-1 rounded ${status >= 200 && status < 300 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
                            {status}
                        </span>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Close</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    <div className="w-64 shrink-0 flex flex-col gap-2">
                        {endpoints.map((ep) => (
                            <Button
                                key={ep.key}
                                size="sm"
                                variant={selected === ep.key ? "default" : "outline"}
                                onClick={() => callEndpoint(ep)}
                                disabled={loading}
                                className="justify-start"
                            >
                                {ep.label}
                            </Button>
                        ))}
                    </div>
                    <div className="flex-1">
                        <pre className="bg-muted p-3 rounded overflow-auto max-h-[50vh] text-xs">
                            <code>{body || (loading ? "Loading…" : "Select an endpoint…")}</code>
                        </pre>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


